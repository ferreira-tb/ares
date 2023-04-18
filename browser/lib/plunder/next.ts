import { toRaw } from 'vue';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { getAllTemplates } from '$lib/plunder/templates';
import { queryAvailableUnits } from '$lib/plunder/units';
import { getPlunderTargets } from '$lib/plunder/targets';
import { PlunderError } from '$browser/error';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { useCurrentVillageStore } from '$renderer/stores/village';
import type { PlunderGroupType } from '$types/plunder';
import type { PlunderTargetInfo } from '$lib/plunder/targets';

export async function handleLackOfTargets(groupInfo: PlunderGroupType | null) {
    try {
        await queryAvailableUnits();
        const config = usePlunderConfigStore();
        const wentToNextPage = await navigateToNextPage(config, groupInfo);
        if (wentToNextPage || !config.groupAttack || !groupInfo) return;
        navigateToNextVillage(config, groupInfo);
    } catch (err) {
        PlunderError.catch(err);
    };
};

async function navigateToNextPage(config: ReturnType<typeof usePlunderConfigStore>, groupInfo: PlunderGroupType | null) {
    try {
        // Verifica se há tropas disponíveis em algum dos modelos.
        if (!canSomeTemplateAttack(config)) return false;
        
        let maxDistance = config.maxDistance;
        if (config.groupAttack && groupInfo) {
            const currentVillageId = useCurrentVillageStore().getId();
            const villageStatus = groupInfo.villages.get(currentVillageId);
            if (villageStatus) maxDistance = villageStatus.waveMaxDistance;
        };

        const targets: ReadonlyArray<Readonly<PlunderTargetInfo>> = Array.from(getPlunderTargets().values());
        const biggestDistance = targets.reduce((biggest, target) => Math.max(biggest, target.distance), 0);
        if (biggestDistance >= maxDistance) return false;
        
        const navigated = await ipcInvoke('plunder:navigate-to-next-page');
        return navigated;

    } catch (err) {
        PlunderError.catch(err);
        return false;
    };
};

function navigateToNextVillage(config: ReturnType<typeof usePlunderConfigStore>, groupInfo: PlunderGroupType) {
    try {
        const currentVillageId = useCurrentVillageStore().getId();
        const groupVillage = groupInfo.villages.getStrict(currentVillageId);
        if (groupVillage.done) return;

        if (!canSomeTemplateAttack(config) || (groupVillage.waveMaxDistance >= config.maxDistance)) {
            groupVillage.done = true;
        } else {
            groupVillage.waveMaxDistance += config.fieldsPerWave;
        };

        ipcSend('plunder:update-group-info', toRaw(groupInfo));
        ipcSend('plunder:navigate-to-next-village', currentVillageId);

    } catch (err) {
        PlunderError.catch(err);
    };
};

/** Verifica se algum dos modelos pode ser usado para atacar. */
function canSomeTemplateAttack(config: ReturnType<typeof usePlunderConfigStore>) {
    const templatesMap = getAllTemplates();

    // Se os ataques com o modelo C não estiverem habilitados, remove-o da lista.
    let allTemplates = Array.from(templatesMap.values());
    if (!config.useC) allTemplates = allTemplates.filter((template) => template.type !== 'c');

    const status = allTemplates.map((template) => template.ok.value);
    return status.some((ok) => ok);
};