import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlayerStore = defineStore('player', () => {
    const name = ref<string | null>(null);
    const id = ref<number | null>(null);
    const points = ref<number>(0);
    const villageAmount = ref<number>(0);
    const incomings = ref<number>(0);

    return {
        name,
        id,
        points,
        villageAmount,
        incomings
    } satisfies PiniaPlayerStoreType;
});