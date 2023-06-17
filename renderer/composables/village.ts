import { ref, watchEffect } from 'vue';
import { ipcInvoke } from '$renderer/ipc';
import type { Ref } from 'vue';

export function useVillage(villageId: Ref<number | null>) {
    const village = ref<WorldVillageType | null>(null);

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

    return village;
};