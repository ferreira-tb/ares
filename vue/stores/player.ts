import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { PiniaPlayerStoreType } from '$types/stores';

export const usePlayerStore = defineStore('player', () => {
    const name = ref<string | null>(null);
    const id = ref<number | null>(null);
    const points = ref<number | null>(null);
    const villageAmount = ref<number | null>(null);

    return {
        name,
        id,
        points,
        villageAmount
    } satisfies PiniaPlayerStoreType;
});