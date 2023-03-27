import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { getPlunderInfo, updatePlunderConfig } from '$browser/lib/plunder/data';
import { useCurrentVillageStore } from '$global/stores/village';
import { usePlunderStore, usePlunderConfigStore } from '$global/stores/plunder';
import { ipcInvoke, ipcSend } from '$global/ipc';
import type { Router } from 'vue-router';

export function setNavigationGuards(router: Router) {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const currentVillageStore = useCurrentVillageStore();

    const { page: plunderPage } = storeToRefs(plunderStore);
    const { active: isPlunderActive } = storeToRefs(plunderConfigStore);
    const { id: currentVillageId } = storeToRefs(currentVillageStore);

    router.beforeEach(async (to) => {
        if (to.name === 'am_farm') await preparePlunderRoute();
    });

    // As informações sobre a aldeia atual (para uso no AS) são atualizadas após o componente ser renderizado.
    // Isso significa que as informações presentes no cache no momento que o guarda é executado refletem a aldeia anterior.
    router.beforeEach(async (to) => {
        if (to.name !== 'am_farm' || !currentVillageId.value || !isPlunderActive.value) {
            return true;
        };

        // Se houver navegação entre aldeias sem que o usuário deixe o AS, a página permanece a mesma.
        // Isso é um problema, pois a nova aldeia deveria começar a atacar a partir da primeira página.
        const villageInfo = await ipcInvoke('get-plunder-cache-village-info');
        if (
            plunderPage.value !== 0 &&
            villageInfo &&
            currentVillageId.value !== villageInfo.id
        ) {
            queueMicrotask(() => ipcSend('navigate-to-first-plunder-page'));
            return false;
        };

        return true;
    });
};

async function preparePlunderRoute() {
    await getPlunderInfo();
    await updatePlunderConfig();
    await nextTick();
};