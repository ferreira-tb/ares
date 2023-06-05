import { ref, type Ref } from 'vue';
import { until, useStyleTag, useMutationObserver } from '@vueuse/core';
import { isInstanceOf, isInteger } from '$shared/guards';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useFeaturesStore } from '$renderer/stores';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { PlunderError } from '$browser/error';

class PlunderGroup implements PlunderGroupType {
    readonly id: number;
    readonly villages = new Map<number, PlunderGroupVillageType>();

    constructor(plunderGroupId: number) {
        this.id = plunderGroupId;
    };
};

class PlunderGroupVillage implements PlunderGroupVillageType {
    waveMaxDistance: number;
    done: boolean = false;

    constructor(fieldsPerWave: number) {
        this.waveMaxDistance = fieldsPerWave;
    };
};

export async function queryPlunderGroupInfo(): Promise<PlunderGroupType | null> {
    let groupInfo: PlunderGroupType | null = null;
    try {
        const config = usePlunderConfigStore();
        const features = useFeaturesStore();
        
        if (
            !features.premium ||
            !features.farmAssistant ||
            !config.groupAttack ||
            !config.plunderGroupId
        ) {
            return null;
        };

        groupInfo = await ipcInvoke('plunder:get-group-info');
        groupInfo ??= await queryVillagesFromPopup(config);

    } catch (err) {
        PlunderError.catch(err);
        groupInfo = null;

    } finally {
        ipcSend('plunder:update-group-info', groupInfo);
    };

    return groupInfo;
};

async function queryVillagesFromPopup(config: ReturnType<typeof usePlunderConfigStore>) {
    let groupInfo: PlunderGroupType | null = null;
    const { popup, cleanup } = await openGroupPopup();

    try {
        const groupId = config.plunderGroupId;
        if (!isInteger(groupId) || groupId <= 0) {
            throw new PlunderError(`${groupId} is not a valid plunder group id.`);
        };
        
        groupInfo = new PlunderGroup(groupId);

        const selectedGroup = popup.queryAndAssert('#group_id option[selected]');
        const selectedGroupId = selectedGroup.getAttributeAsIntStrict('value');
        if (selectedGroupId !== groupId) {
            queueMicrotask(() => ipcSend('plunder:navigate-to-group'));
            return null;
        };

        const villages = await getVillagesIdFromPopup(popup);
        villages.forEach((id) => {
            groupInfo?.villages.set(id, new PlunderGroupVillage(config.fieldsPerWave));
        });

        return groupInfo;

    } catch (err) {
        PlunderError.catch(err);
        return null;

    } finally {
        cleanup?.();
    };
};

function useGroupPopup(): { popup: Ref<HTMLElement | null>, query: () => void, selector: string } {
    const selector = '.popup_helper #group_popup';
    const popupElement = document.querySelector<HTMLElement>(selector);
    const popup = ref<HTMLElement | null>(popupElement);

    const query = () => void (popup.value = document.querySelector<HTMLElement>(selector));
    return { popup, query, selector };
};

async function setPopupStyle(selector: string) {
    const css = `${selector} { visibility: hidden !important; }`;
    const { unload, isLoaded } = useStyleTag(css, { immediate: true });
    await until(isLoaded).toBe(true, { timeout: 3000, throwOnTimeout: true });
    return unload;
};

async function openGroupPopup(): Promise<{ popup: HTMLElement, cleanup: (() => void) | null }> {
    const { popup, query, selector } = useGroupPopup();
    if (popup.value) return { popup: popup.value, cleanup: null };
    
    const idList = ['group_table', 'group_list_content', 'group_popup_content_container', 'select_group_box'] as const;
    const observer = useMutationObserver(document.body, (mutations) => {
        const found = mutations.some((mutation) => {
            return Array.from(mutation.addedNodes).some((node) => {
                if (!isInstanceOf(node, HTMLElement)) return false;
                return idList.some((id) => node.matches(`.popup_helper #${id}`));
            });
        });

        if (!found) return;
        observer.stop();
        query();
    }, { subtree: true, childList: true });

    const removeStyle = await setPopupStyle(selector);
    const opener = document.queryAndAssert<HTMLAnchorElement>('#menu_row2 td #open_groups');
    opener.click();

    try {
        await until(popup).toBeTruthy({ timeout: 3000, throwOnTimeout: true });
    } catch {
        throw new PlunderError('Timeout: could not open plunder group popup.');
    };
    
    return {
        popup: (popup.value as unknown) as HTMLElement,
        cleanup: () => {
            const closer = document.querySelector<HTMLAnchorElement>('#closelink_group_popup');
            closer?.click();
            removeStyle();
        }
    };
};

function useGroupPopupVillages(popup: HTMLElement): { villages: Ref<Set<number>>, query: () => void } {
    const selector = '#group_table a.select-village[data-village-id]';
    const getId = (el: Element) => el.getAttributeAsIntStrict('data-village-id');
    const villagesSet = popup.queryAsSet(selector, getId);
    const villages = ref(villagesSet);

    const query = () => void (villages.value = popup.queryAsSet(selector, getId));
    return { villages, query };
};

async function getVillagesIdFromPopup(popup: HTMLElement): Promise<Set<number>> {
    const { villages, query } = useGroupPopupVillages(popup);

    // Quando não há aldeias no grupo, surge uma mensagem com essa informação dentro do popup.
    let infoBox = popup.querySelector('#group_list_content .info_box');
    if (infoBox) return villages.value;

    // Se há aldeias no grupo, mas a mensagem não apareceu, então o popup ainda está carregando seu conteúdo.
    const observer = useMutationObserver(popup, (mutations) => {
        const found = mutations.some((mutation) => {
            return Array.from(mutation.addedNodes).some((node) => {
                if (!isInstanceOf(node, HTMLElement)) return false;
                return node.matches('#group_popup_content_container');
            });
        });

        if (!found) return;
        observer.stop();
        query();
    }, { subtree: true, childList: true });

    await until(villages).toMatch((v) => v.size > 0, { timeout: 3000 });
    observer.stop();

    infoBox = popup.querySelector('#group_list_content .info_box');
    if (!infoBox && villages.value.size === 0) {
        throw new PlunderError('Could not get villages from group popup.');
    };

    return villages.value;
};