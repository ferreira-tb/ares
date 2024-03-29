import { nextTick, toRef } from 'vue';
import { storeToRefs } from 'pinia';
import { until } from '@vueuse/core';
import { getPlunderInfo, updatePlunderConfig } from '$browser/lib/plunder/data';
import { useGameDataStore, usePlunderStore, usePlunderConfigStore } from '$renderer/stores';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { BrowserRouterError } from '$browser/error';
import type { Router } from 'vue-router';

export function setPlunderNavigationGuards(router: Router) {
    const gameData = useGameDataStore();
    const plunder = usePlunderStore();
    const plunderConfig = usePlunderConfigStore();

    const { groupId: currentGroupId, village } = storeToRefs(gameData);
    const { page: plunderPage } = storeToRefs(plunder);
    const { active: isPlunderActive, plunderGroupId, groupAttack } = storeToRefs(plunderConfig);

    const currentVillageId = toRef(() => village.value.id);

    router.beforeEach(async (to) => {
        try {
            if (to.name !== 'am_farm' || !isPlunderActive.value) return true;
            if (!groupAttack.value || !plunderGroupId.value) return true;

            await until(currentGroupId).toMatch((id) => typeof id === 'number', { timeout: 3000, throwOnTimeout: true });
            if (plunderGroupId.value !== currentGroupId.value) {
                await nextTick();
                ipcSend('plunder:navigate-to-group');
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
            const villageInfo = await ipcInvoke('plunder:get-pages-info');
            if (villageInfo && plunderPage.value !== 0 && currentVillageId.value !== villageInfo.id) {
                await nextTick();
                ipcSend('plunder:navigate-to-first-page');
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