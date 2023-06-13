import { effectScope, ref, watchEffect } from 'vue';
import { tryOnScopeDispose } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import type { Ref } from 'vue';

export function useVillage(villageId: Ref<number | null>) {
    const scope = effectScope();
    const village = ref<WorldVillageType | null>(null);

    scope.run(() => {
        watchEffect(async () => {
            if (!villageId.value) {
                village.value = null;
                return;
            };
            
            const data = await ipcInvoke('world-data:get-village', villageId.value);
            if (data.length === 0) {
                village.value = null;
                return;
            };

            village.value = data[0];
        });
    });

    tryOnScopeDispose(() => scope.stop());
    return village;
};