import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useIncomingsStore = defineStore('incoming-attacks', () => {
    const amount = ref<number | null>(null);
    const incomings = ref<IncomingAttack[]>([]);

    return {
        amount,
        incomings
    } satisfies PiniaIncomingAttacksStoreType;
});