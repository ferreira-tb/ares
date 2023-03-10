import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PiniaPanelStoreType } from '$types/stores.js';

export const usePanelStore = defineStore('panel', () => {
    const phobosWorkerPort = ref<MessagePort | null>(null);
    const villageGroups = ref<Map<number, string>>(new Map());

    return {
        phobosWorkerPort,
        villageGroups
    } satisfies PiniaPanelStoreType;
});