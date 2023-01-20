import { ipcRenderer } from 'electron';
import { assert } from '@/error.js';
import { usePhobiaStore } from '@/stores/store.js';
import type { Pinia } from 'pinia';

export function setChildWindowEvents(pinia: Pinia) {
    const phobiaStore = usePhobiaStore(pinia);

    ipcRenderer.on('game-url', (_e, url) => {
        assert(typeof url === 'string', 'A URL é inválida.');
        if (!url.includes('tribalwars')) return;
        phobiaStore.currentURL = url;
    });

    ipcRenderer.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        assert(typeof currentX === 'number', 'A coordenada X é inválida.');
        assert(typeof currentY === 'number', 'A coordenada Y é inválida.');
        phobiaStore.currentX = currentX;
        phobiaStore.currentY = currentY;
    });
};