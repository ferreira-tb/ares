import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePlunderStore = defineStore('plunder', () => {
    /** Indica se o Plunder está ativado. */
    const status = ref<boolean>(false);
    /** Determina se o Plunder deve atacar aldeias com muralha. */
    const ignoreWall = ref<boolean>(false);
    /** Determina se o Plunder deve demolir a muralha das aldeias. */
    const destroyWall = ref<boolean>(false);
    /** Determina se o Plunder deve utilizar o grupo Insidious ao atacar. */
    const groupAttack = ref<boolean>(false);
    /** Determina se o Plunder deve atacar usando o modelo C. */
    const useCModel = ref<boolean>(false);
    /** Se ativado, o Plunder não terá delay entre os ataques. */
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