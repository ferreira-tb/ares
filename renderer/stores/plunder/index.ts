import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PiniaPlunderStoreType, PiniaPlunderHistoryStoreType } from '$types/stores';

export * from '$renderer/stores/plunder/config';

export const usePlunderStore = defineStore('plunder', () => {
    const hideAttacked = ref<boolean>(true);
    const page = ref<number>(0);
    const pageSize = ref<number | null>(null);
    const plunderExhausted = ref<boolean>(false);

    return {
        hideAttacked,
        page,
        pageSize,
        plunderExhausted
    } satisfies PiniaPlunderStoreType;
});

export const usePlunderHistoryStore = defineStore('plunder-history', () => {
    const wood = ref<number>(0);
    const stone = ref<number>(0);
    const iron = ref<number>(0);
    const attackAmount = ref<number>(0);
    const destroyedWalls = ref<number>(0);

    function useTotal() {
        return computed(() => wood.value + stone.value + iron.value);
    };

    return {
        wood,
        stone,
        iron,
        destroyedWalls,
        attackAmount,

        useTotal
    } satisfies PiniaPlunderHistoryStoreType;
});