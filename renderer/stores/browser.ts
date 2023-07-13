import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useBrowserStore = defineStore('browser', () => {
    const captcha = ref<boolean>(false);
    const responseTime = ref<number | null>(null);

    return {
        captcha,
        responseTime
    } satisfies PiniaBrowserStoreType;
});