import { ipcRenderer } from 'electron';
import { assertString } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc.js';
import { useAresStore } from '$vue/stores/ares.js';
import { ipcSend } from '$global/ipc.js';
import { BrowserError } from '$browser/error.js';
import { setDevEvents } from '$browser/events/dev.js';
import { setPlunderEvents } from '$browser/events/plunder.js';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    // Pinia.
    const aresStore = useAresStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            BrowserError.catch(err);
        };
    });
    
    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            aresStore.$patch(gameData);
            ipcSend('update-game-data', gameData);

        } catch (err) {
            BrowserError.catch(err);
        };
    });

    // Outros eventos.
    setDevEvents();
    setPlunderEvents(pinia);
};