import { defineStore } from 'pinia';
import { ref } from 'vue';

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
};

export type PlunderStateValue = PlunderState[keyof PlunderState];

export const usePlunderStore = defineStore('plunder', () => {
    const status = ref<boolean>(false);
    const ignoreWall = ref<boolean>(false);
    const destroyWall = ref<boolean>(false);
    const groupAttack = ref<boolean>(false);
    const useCModel = ref<boolean>(false);
    const ignoreDelay = ref<boolean>(false);

    return { 
        status,
        ignoreWall,
        destroyWall,
        groupAttack,
        useCModel,
        ignoreDelay
    };
});