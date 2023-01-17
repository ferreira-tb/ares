import { ipcRenderer } from 'electron';
import { ref, watch } from 'vue';
import { assert } from './error.js';

const currentURL = ref<string | null>(null);

ipcRenderer.on('game-url', (_e, url) => {
    assert(typeof url === 'string', 'A URL é inválida.');
    if (!url.includes('tribalwars')) return;
    currentURL.value = url;
});

watch(currentURL, () => {
    console.log(currentURL.value);
});