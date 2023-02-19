import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PlunderConfigType, PlunderedAmount } from '$types/plunder.js';

export const usePlunderStore = defineStore('plunder', () => {
    /** Indica se as aldeias sob ataque estão ocultas. */
    const hideAttacked = ref<boolean>(true);
    /** Página atual. */
    const page = ref<number>(0);
    /** Quantidade de aldeias por página. */
    const pageSize = ref<number>(15);
    const plunderExhausted = ref<boolean>(false);

    return {
        hideAttacked,
        page,
        pageSize,
        plunderExhausted
    };
});

export const usePlunderConfigStore = defineStore('plunder-config', () => {
    const active = ref<boolean>(false);
    const ignoreWall = ref<boolean>(false);
    const destroyWall = ref<boolean>(false);
    const groupAttack = ref<boolean>(false);
    const useC = ref<boolean>(false);
    const ignoreDelay = ref<boolean>(false);
    const blindAttack = ref<boolean>(false);

    const resourceRatio = ref<number>(0.8);
    const minutesUntilReload = ref<number>(10);

    function raw(): PlunderConfigType {
        return {
            active: active.value,
            ignoreWall: ignoreWall.value,
            destroyWall: destroyWall.value,
            groupAttack: groupAttack.value,
            useC: useC.value,
            ignoreDelay: ignoreDelay.value,
            blindAttack: blindAttack.value,
            
            resourceRatio: resourceRatio.value,
            minutesUntilReload: minutesUntilReload.value
        };
    };

    return {
        active,
        ignoreWall,
        destroyWall,
        groupAttack,
        useC,
        ignoreDelay,
        blindAttack,
        resourceRatio,
        minutesUntilReload,
        raw
    };
});

export const usePlunderHistoryStore = defineStore('plunder-history', () => {
    const wood = ref<number>(0);
    const stone = ref<number>(0);
    const iron = ref<number>(0);
    const attackAmount = ref<number>(0);
    const total = computed(() => wood.value + stone.value + iron.value);

    function raw(): PlunderedAmount {
        return {
            wood: wood.value,
            stone: stone.value,
            iron: iron.value,
            attackAmount: attackAmount.value,
            total: total.value
        };
    };

    function reset() {
        wood.value = 0;
        stone.value = 0;
        iron.value = 0;
        attackAmount.value = 0;
    };

    return {
        wood,
        stone,
        iron,
        total,
        attackAmount,
        raw,
        reset
    };
});