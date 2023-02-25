import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type { PlunderConfigType, PlunderAttackDetails, BlindAttackPattern } from '$types/plunder.js';
import type { PiniaPlunderStoreType, PiniaPlunderConfigStoreType, PiniaPlunderHistoryStoreType } from '$types/stores.js';

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
    } satisfies PiniaPlunderStoreType;
});

export const usePlunderConfigStore = defineStore('plunder-config', () => {
    // Painel
    const active = ref<boolean>(false);
    const ignoreWall = ref<boolean>(false);
    const destroyWall = ref<boolean>(false);
    const groupAttack = ref<boolean>(false);
    const useC = ref<boolean>(false);
    const ignoreDelay = ref<boolean>(false);
    const blindAttack = ref<boolean>(false);

    // Configurações
    const wallLevelToIgnore = ref<number>(1);
    const wallLevelToDestroy = ref<number>(1);
    const attackDelay = ref<number>(200);
    const blindAttackPattern = ref<BlindAttackPattern>('smaller');
    const resourceRatio = ref<number>(0.8);
    const minutesUntilReload = ref<number>(10);
    const maxDistance = ref<number>(20);
    const ignoreOlderThan = ref<number>(10);

    function raw(): PlunderConfigType {
        return {
            active: active.value,
            ignoreWall: ignoreWall.value,
            wallLevelToIgnore: wallLevelToIgnore.value,
            destroyWall: destroyWall.value,
            wallLevelToDestroy: wallLevelToDestroy.value,
            groupAttack: groupAttack.value,
            useC: useC.value,
            ignoreDelay: ignoreDelay.value,
            attackDelay: attackDelay.value,
            blindAttack: blindAttack.value,
            blindAttackPattern: blindAttackPattern.value,
            resourceRatio: resourceRatio.value,
            minutesUntilReload: minutesUntilReload.value,
            maxDistance: maxDistance.value,
            ignoreOlderThan: ignoreOlderThan.value
        };
    };

    return {
        active,
        ignoreWall,
        wallLevelToIgnore,
        destroyWall,
        wallLevelToDestroy,
        groupAttack,
        useC,
        ignoreDelay,
        attackDelay,
        blindAttack,
        blindAttackPattern,
        resourceRatio,
        minutesUntilReload,
        maxDistance,
        ignoreOlderThan,
        raw
    } satisfies PiniaPlunderConfigStoreType;
});

export const usePlunderHistoryStore = defineStore('plunder-history', () => {
    const wood = ref<number>(0);
    const stone = ref<number>(0);
    const iron = ref<number>(0);
    const attackAmount = ref<number>(0);
    const destroyedWalls = ref<number>(0);
    const total = computed(() => wood.value + stone.value + iron.value);

    function raw(): PlunderAttackDetails {
        return {
            wood: wood.value,
            stone: stone.value,
            iron: iron.value,
            attackAmount: attackAmount.value,
            total: total.value,
            destroyedWalls: destroyedWalls.value
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
        destroyedWalls,
        attackAmount,
        raw,
        reset
    } satisfies PiniaPlunderHistoryStoreType;
});