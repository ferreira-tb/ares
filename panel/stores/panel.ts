import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PiniaPanelStoreType } from '$types/stores';

export const usePanelStore = defineStore('panel', () => {
    const isVisible = ref<boolean>(true);

    return {
        isVisible
    } satisfies PiniaPanelStoreType;
});