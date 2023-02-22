import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PiniaFeaturesStoreType } from '$types/stores.js';

export const useFeaturesStore = defineStore('features', () => {
    const premium = ref<boolean | null>(null);
    const accountManager = ref<boolean | null>(null);
    const farmAssistant = ref<boolean | null>(null);

    return {
        premium,
        accountManager,
        farmAssistant
    } satisfies PiniaFeaturesStoreType;
});