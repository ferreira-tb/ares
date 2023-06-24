import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { DefaultPlunderHistory } from '$common/templates';

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
    const history = new DefaultPlunderHistory();

    const wood = ref<number>(history.wood);
    const stone = ref<number>(history.stone);
    const iron = ref<number>(history.iron);
    const attackAmount = ref<number>(history.attackAmount);
    const destroyedWalls = ref<number>(history.destroyedWalls);

    function useTotal() {
        return computed(() => wood.value + stone.value + iron.value);
    }

    return {
        wood,
        stone,
        iron,
        destroyedWalls,
        attackAmount,

        useTotal
    } satisfies PiniaPlunderHistoryStoreType;
});