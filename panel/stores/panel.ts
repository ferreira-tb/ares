import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePanelStore = defineStore('panel', () => {
    const isVisible = ref<boolean>(true);

    return {
        isVisible
    } satisfies PiniaPanelStoreType;
});