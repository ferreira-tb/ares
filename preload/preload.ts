import { ipcRenderer } from 'electron';
import { ref, watch } from 'vue';
import { assert } from '@/error.js';
import { useCurrentScreen } from '@/composables/game.js';
import { gameURL } from '@/constants.js';

const currentURL = ref<string>(gameURL);

watch(currentURL, () => {
    console.log(currentURL.value);
    console.log(useCurrentScreen(currentURL).value);
});

ipcRenderer.on('game-url', (_e, url) => {
    assert(typeof url === 'string', 'A URL é inválida.');
    if (!url.includes('tribalwars')) return;
    currentURL.value = url;
});