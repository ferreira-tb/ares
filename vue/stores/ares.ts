import { defineStore } from 'pinia';
import { ref } from 'vue';
import { gameURL } from '$global/utils/constants.js';
import { useCurrentScreen } from '$vue/composables/game.js';
import { ipcInvoke } from '$global/ipc.js';

export const useAresStore = defineStore('ares', () => {
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

export async function updateCurrentWorld() {
    const world = await ipcInvoke('get-current-world');
    const aresStore = useAresStore();
    aresStore.currentWorld = world;
};