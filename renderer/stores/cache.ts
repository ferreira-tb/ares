import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useCacheStore = defineStore('ares-cache', () => {
    const captcha = ref<boolean>(false);
    const responseTime = ref<number | null>(null);

    return {
        captcha,
        responseTime
    } satisfies PiniaCacheStoreType;
});