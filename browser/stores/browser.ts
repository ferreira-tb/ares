import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PiniaBrowserStoreType } from '$types/stores';

export const useBrowserStore = defineStore('browser', () => {
    const isDeimosReady = ref<boolean>(false);

    return {
        isDeimosReady
    } satisfies PiniaBrowserStoreType;
});