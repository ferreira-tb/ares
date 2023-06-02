import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBrowserStore = defineStore('browser', () => {
    const isIpcTribalReady = ref<boolean>(false);

    return {
        isIpcTribalReady
    } satisfies PiniaBrowserStoreType;
});