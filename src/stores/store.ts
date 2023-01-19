import { defineStore } from 'pinia';
import { ref } from 'vue';
import { patchPlunderStore } from '@/stores/plunder.js';
import { ClaustrophobicError } from '@/error.js';
import { gameURL } from '@/constants.js';
import { useCurrentScreen } from '@/composables/game.js';

export const usePhobiaStore = defineStore('phobia', () => {
    /** URL da página atual. */
    const currentURL = ref<string>(gameURL);
    /** Página atual. */
    const currentScreen = useCurrentScreen(currentURL);
    /** Coordenada X da aldeia atual. */
    const currentX = ref<number>(0);
    /** Coordenada Y da aldeia atual. */
    const currentY = ref<number>(0);

    return {
        currentURL,
        currentScreen,
        currentX,
        currentY
    };
});

/** Carrega na janela filha as informações que estão salvas no armazenamento da aplicação. */
export async function setChildWindowSavedState() {
    try {
        await patchPlunderStore();

    } catch (err) {
        ClaustrophobicError.handle(err)
    };
};