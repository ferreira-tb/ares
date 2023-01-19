import { ref } from 'vue';
import { defineStore, getActivePinia, type Pinia } from 'pinia';
import { ipcInvoke } from '@/ipc.js';

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

/**
 * Atualiza os dados da store com base nos valores salvos no arquivo de configuração.
 * @param pinia Instância ativa do Pinia.
 * @returns A store do Plunder.
 */
export async function patchPlunderStore(pinia?: Pinia): Promise<ReturnType<typeof usePlunderStore>> {
    if (!pinia) pinia = getActivePinia();

    const plunderStore = usePlunderStore(pinia);
    const plunderState = await ipcInvoke('get-plunder-state');
    if (plunderState) plunderStore.$patch({ ...plunderState });

    return plunderStore;
};