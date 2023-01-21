import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import { ipcInvoke } from '@/ipc.js';
import type { PlunderedAmount } from '@/types.js';

export type PlunderState = {
    /** Indica se o Plunder está ativado. */
    status: boolean;
    /** Determina se o Plunder deve atacar aldeias com muralha. */
    ignoreWall: boolean;
    /** Determina se o Plunder deve demolir a muralha das aldeias. */
    destroyWall: boolean;
    /** Determina se o Plunder deve utilizar o grupo Insidious ao atacar. */
    groupAttack: boolean;
    /** Determina se o Plunder deve atacar usando o modelo C. */
    useCModel: boolean;
    /** Se ativado, o Plunder não terá delay entre os ataques. */
    ignoreDelay: boolean;
    /** Se ativado, o Plunder não levará em consideração as informações dos exploradores. */
    blindAttack: boolean;
};

export type PlunderStateValue = PlunderState[keyof PlunderState];

export const usePlunderStore = defineStore('plunder', () => {
    const status = ref<boolean>(false);
    const ignoreWall = ref<boolean>(false);
    const destroyWall = ref<boolean>(false);
    const groupAttack = ref<boolean>(false);
    const useCModel = ref<boolean>(false);
    const ignoreDelay = ref<boolean>(false);
    const blindAttack = ref<boolean>(false);

    return {
        status,
        ignoreWall,
        destroyWall,
        groupAttack,
        useCModel,
        ignoreDelay,
        blindAttack
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

/** Atualiza os dados da store com base nos valores salvos no armazenamento. */
export async function patchPlunderStore() {
    const plunderStore = usePlunderStore();
    const plunderState = await ipcInvoke('get-plunder-state');
    if (plunderState) plunderStore.$patch({ ...plunderState });
};