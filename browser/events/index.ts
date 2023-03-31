import { ipcRenderer } from 'electron';
import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
import { updateGameData } from '$browser/utils/helpers';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    ipcRenderer.on('get-game-data', () => updateGameData());

    // Outros eventos.
    setDevEvents();
    setPlunderEvents(pinia);
};