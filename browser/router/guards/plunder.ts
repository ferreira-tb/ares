import { nextTick } from 'vue';
import { storeToRefs } from 'pinia';
import { until } from '@vueuse/core';
import { getPlunderInfo, updatePlunderConfig } from '$browser/lib/plunder/data';
import { useCurrentVillageStore } from '$global/stores/village';
import { usePlunderStore, usePlunderConfigStore } from '$global/stores/plunder';
import { useGroupsStore } from '$global/stores/groups';
import { ipcInvoke, ipcSend } from '$global/ipc';
import { BrowserRouterError } from '$browser/error';
import type { Router } from 'vue-router';

export function setPlunderNavigationGuards(router: Router) {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const currentVillageStore = useCurrentVillageStore();
    const groupsStore = useGroupsStore();

    const { page: plunderPage } = storeToRefs(plunderStore);
    const { active: isPlunderActive, plunderGroupId, groupAttack } = storeToRefs(plunderConfigStore);
    const { id: currentVillageId } = storeToRefs(currentVillageStore);
    const { groupId: currentGroupId } = storeToRefs(groupsStore);

    router.beforeEach(async (to) => {
        try {
            if (to.name !== 'am_farm' || !isPlunderActive.value) return true;
            if (!groupAttack.value || !plunderGroupId.value) return true;

            await until(currentGroupId).toMatch((id) => typeof id === 'number', { timeout: 3000, throwOnTimeout: true });
            if (plunderGroupId.value !== currentGroupId.value) {
                nextTick(() => ipcSend('navigate-to-plunder-group'));
                return false;
            };

            return true;

        } catch (err) {
            BrowserRouterError.catch(err);
            return false;
        };
    });

    // As informações sobre a aldeia atual (para uso no AS) são atualizadas após o componente ser renderizado.
    // Isso significa que as informações presentes no cache no momento que o guarda é executado refletem a aldeia anterior.
    router.beforeEach(async (to) => {
        try {
            if (to.name !== 'am_farm' || !isPlunderActive.value) return true;
            await until(currentVillageId).toMatch((id) => typeof id === 'number', { timeout: 3000, throwOnTimeout: true });

            // Se houver navegação entre aldeias sem que o usuário deixe o AS, a página permanece a mesma.
            // Isso é um problema, pois a nova aldeia deveria começar a atacar a partir da primeira página.
            const villageInfo = await ipcInvoke('get-plunder-cache-village-info');
            if (villageInfo && plunderPage.value !== 0 && currentVillageId.value !== villageInfo.id) {
                nextTick(() => ipcSend('navigate-to-first-plunder-page'));
                return false;
            };

            return true;
            
        } catch (err) {
            BrowserRouterError.catch(err);
            return false;
        };
    });
};

export async function preparePlunderRoute() {
    await getPlunderInfo();
    await updatePlunderConfig();
    await nextTick();
};