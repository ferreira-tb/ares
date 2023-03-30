import { ref } from 'vue';
import { until, useStyleTag, useMutationObserver } from '@vueuse/core';
import { isInstanceOf, assertPositiveInteger } from '@tb-dev/ts-guard';
import { ipcSend, ipcInvoke } from '$global/ipc';
import { useFeaturesStore } from '$global/stores/features';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { PlunderError } from '$browser/error';
import type { Ref } from 'vue';
import type { PlunderGroupType, PlunderGroupVillageType } from '$types/plunder';

class PlunderGroup implements PlunderGroupType {
    readonly id: number;
    readonly villages: Map<number, PlunderGroupVillageType> = new Map();

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

export async function updateGroupInfo(isGroupAttackEnabled: boolean, groupInfo: Ref<PlunderGroupType | null>) {
    try {
        if (isGroupAttackEnabled) {
            groupInfo.value = await queryPlunderGroupInfo();
        } else {
            groupInfo.value = null;
            ipcSend('update-plunder-cache-group-info', null);
        };
        
    } catch (err) {
        PlunderError.catch(err);
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

        groupInfo = await ipcInvoke('get-plunder-cache-group-info');
        if (!groupInfo) groupInfo = await queryVillagesFromPopup(config);
        return groupInfo;
        
    } catch (err) {
        PlunderError.catch(err);
        groupInfo = null;
        return null;

    } finally {
        ipcSend('update-plunder-cache-group-info', groupInfo);
    };
};

async function queryVillagesFromPopup(config: ReturnType<typeof usePlunderConfigStore>): Promise<PlunderGroupType> {
    const { popup, cleanup } = await getGroupPopup();
    const groupId = config.plunderGroupId;
    assertPositiveInteger(groupId, `${groupId} is not a valid plunder group id.`);
    const groupInfo = new PlunderGroup(groupId);

    const selectedGroup = popup.queryAndAssert(`#group_id option[selected]`);
    const selectedGroupId = selectedGroup.getAttributeAsIntStrict('value');
    if (selectedGroupId !== groupId) {
        throw new PlunderError(`Selected plunder group id ${selectedGroupId} does not match plunder group id ${groupId}.`);
    };

    const villages = await getVillagesIdFromPopup(popup);
    villages.forEach((id) => groupInfo.villages.set(id, new PlunderGroupVillage(config.fieldsPerWave)));

    if (cleanup) cleanup();
    return groupInfo;
};

async function setPopupStyle(selector: string) {
    const css = `${selector} { visibility: hidden !important; }`;
    const { unload, isLoaded } = useStyleTag(css, { immediate: true });
    await until(isLoaded).toBe(true, { timeout: 3000, throwOnTimeout: true });
    return unload;
};

async function getGroupPopup(): Promise<{ popup: HTMLElement, cleanup: (() => void) | null }> {
    const popup = ref<HTMLElement | null>(null);
    const selector = '.popup_helper #group_popup';
    popup.value = document.querySelector(selector);
    if (popup.value) return { popup: popup.value, cleanup: null };
    
    const removeStyle = await setPopupStyle(selector);
    const opener = document.queryAndAssert<HTMLAnchorElement>('#menu_row2 td #open_groups');
    const idList = ['group_table', 'group_list_content', 'group_popup_content_container', 'select_group_box'];
   
    const observer = useMutationObserver(document.body, (mutations) => {
        const found = mutations.some((mutation) => {
            return Array.from(mutation.addedNodes).some((node) => {
                if (!isInstanceOf(node, HTMLElement)) return false;
                return idList.some((id) => node.matches(`.popup_helper #${id}`));
            });
        });

        if (!found) return;
        observer.stop();
        popup.value = document.queryAndAssert<HTMLElement>(selector);
    }, { subtree: true, childList: true });

    opener.click();
    await until(popup).toBeTruthy({ timeout: 3000, throwOnTimeout: true });

    return {
        popup: (popup.value as unknown) as HTMLElement,
        cleanup: () => {
            const closer = document.queryAndAssert<HTMLAnchorElement>('#closelink_group_popup');
            closer.click();
            removeStyle();
        }
    };
};

async function getVillagesIdFromPopup(popup: HTMLElement): Promise<Set<number>> {
    const selector = '#group_table a.select-village[data-village-id]';
    const getId = (el: Element) => el.getAttributeAsIntStrict('data-village-id');
    const villages = ref(popup.queryAsSet(selector, getId));
    if (villages.value.size > 0) return villages.value;

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
        villages.value = popup.queryAsSet(selector, getId);
    }, { subtree: true, childList: true });

    try {
        await until(villages).toMatch((v) => v.size > 0, { timeout: 3000, throwOnTimeout: true });
    } catch (err) {
        PlunderError.catch(err);
    } finally {
        observer.stop();
        infoBox = popup.querySelector('#group_list_content .info_box');
        if (!infoBox && villages.value.size === 0) throw new PlunderError('Could not get villages from group popup.');
        return villages.value;
    };
};