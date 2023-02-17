import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { isObject } from '@tb-dev/ts-guard';
import { ipcInvoke } from '$global/ipc.js';
import type { PlunderedAmount } from '$types/game.js';

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

    return {
        active,
        ignoreWall,
        destroyWall,
        groupAttack,
        useC,
        ignoreDelay,
        blindAttack,
        resourceRatio,
        minutesUntilReload
    };
});

export const usePlunderHistoryStore = defineStore('plunder-history', () => {
    const wood = ref<number>(0);
    const stone = ref<number>(0);
    const iron = ref<number>(0);
    const attackAmount = ref<number>(0);
    const total = computed(() => wood.value + stone.value + iron.value);

    function getState(): PlunderedAmount {
        return {
            wood: wood.value,
            stone: stone.value,
            iron: iron.value,
            total: total.value,
            attackAmount: attackAmount.value
        };
    };

    function resetState() {
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
        getState,
        resetState
    };
});

export async function patchPlunderConfigStore() {
    const plunderConfigStore = usePlunderConfigStore();
    const plunderState = await ipcInvoke('get-plunder-config');
    if (isObject(plunderState)) plunderConfigStore.$patch(plunderState);
};