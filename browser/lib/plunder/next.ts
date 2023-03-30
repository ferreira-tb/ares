import { assertPositiveInteger } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc';
import { getAllTemplates } from '$lib/plunder/templates';
import { getPlunderTargets } from '$lib/plunder/targets';
import { PlunderError } from '$browser/error';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { useCurrentVillageStore } from '$global/stores/village';
import type { PlunderGroupType } from '$types/plunder';

export async function handleLackOfTargets(groupInfo: PlunderGroupType | null) {
    try {
        const config = usePlunderConfigStore();
        const wentToNextPage = await navigateToNextPage(config);
        if (wentToNextPage || !config.groupAttack || !groupInfo) return;
        navigateToNextVillage(config, groupInfo);
    } catch (err) {
        PlunderError.catch(err);
    };
};

async function navigateToNextPage(config: ReturnType<typeof usePlunderConfigStore>) {
    try {
        // Verifica se há tropas disponíveis em algum dos modelos.
        if (!canSomeTemplateAttack(config)) return false;

        // Em seguida, verifica se algum dos alvos atuais obedece à distância máxima permitida.
        const targets = getPlunderTargets();        
        const distanceList = Array.from(targets.values(), (target) => target.distance);
        if (distanceList.every((distance) => distance >= config.maxDistance)) {
            return false;
        };

        return await ipcInvoke('navigate-to-next-plunder-page');

    } catch (err) {
        PlunderError.catch(err);
        return false;
    };
};

function navigateToNextVillage(config: ReturnType<typeof usePlunderConfigStore>, groupInfo: PlunderGroupType) {
    try {
        const currentVillage = useCurrentVillageStore();
        assertPositiveInteger(currentVillage.id, `${currentVillage.id} is not a valid village id.`);
        const groupVillage = groupInfo.villages.getStrict(currentVillage.id);
        if (groupVillage.done) return;

        if (!canSomeTemplateAttack(config) || (groupVillage.waveMaxDistance >= config.maxDistance)) {
            groupVillage.done = true;
        } else {
            groupVillage.waveMaxDistance += config.fieldsPerWave;
        };

        ipcSend('update-plunder-cache-group-info', groupInfo);
        ipcSend('navigate-to-next-plunder-village', currentVillage.id);
        
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