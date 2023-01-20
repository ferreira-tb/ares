import { defineStore, getActivePinia, type Pinia } from 'pinia';
import { ref } from 'vue';
import { gameURL } from '@/constants.js';
import { useCurrentScreen } from '@/composables/game.js';
import { ipcInvoke } from '@/ipc.js';

export const usePhobiaStore = defineStore('phobia', () => {
    /** URL da página atual. */
    const currentURL = ref<string>(gameURL);
    /** Página atual. */
    const currentScreen = useCurrentScreen(currentURL);
    /** Mundo atual. */
    const currentWorld = ref<string | null>(null);
    /** Coordenada X da aldeia atual. */
    const currentX = ref<number>(0);
    /** Coordenada Y da aldeia atual. */
    const currentY = ref<number>(0);

    return {
        currentURL,
        currentScreen,
        currentWorld,
        currentX,
        currentY
    };
});

export async function updateCurrentWorld(pinia?: Pinia) {
    if (!pinia) pinia = getActivePinia();

    const world = await ipcInvoke('get-current-world');
    if (typeof world !== 'string' && world !== null) return;

    const phobiaStore = usePhobiaStore(pinia);
    phobiaStore.currentWorld = world;
};