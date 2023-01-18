import { ipcRenderer } from 'electron';
import { ref, watch } from 'vue';
import { assert } from '@/error.js';
import { useCurrentScreen } from '@/composables/game.js';
import { gameURL } from '@/constants.js';
import { supportedScreens } from '$/assets.js';

export const currentURL = ref<string>(gameURL);

const unwatch = watch(currentURL, () => {
    const currentScreen = useCurrentScreen(currentURL);
    if (!currentScreen.value || !supportedScreens.includes(currentScreen.value)) return;
    
    unwatch();
});

ipcRenderer.on('game-url', (_e, url) => {
    assert(typeof url === 'string', 'A URL é inválida.');
    if (!url.includes('tribalwars')) return;
    currentURL.value = url;
});