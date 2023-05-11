import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBrowserStore = defineStore('browser', () => {
    const isDeimosReady = ref<boolean>(false);

    return {
        isDeimosReady
    } satisfies PiniaBrowserStoreType;
});