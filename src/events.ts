import { ipcRenderer } from 'electron';
import { assertType } from '@/error.js';
import { usePhobiaStore } from '@/stores/store.js';
import type { Pinia } from 'pinia';

export function setChildWindowEvents(pinia: Pinia) {
    const phobiaStore = usePhobiaStore(pinia);

    ipcRenderer.on('page-url', (_e, url) => {
        assertType(typeof url === 'string', 'A URL é inválida.');
        if (!url.includes('tribalwars')) return;
        phobiaStore.currentURL = url;
    });

    ipcRenderer.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        assertType(typeof currentX === 'number', 'A coordenada X é inválida.');
        assertType(typeof currentY === 'number', 'A coordenada Y é inválida.');
        phobiaStore.currentX = currentX;
        phobiaStore.currentY = currentY;
    });
};