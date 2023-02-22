import { ipcRenderer } from 'electron';
import { Deimos } from '$deimos/shared/ipc.js';
import { useAresStore } from '$vue/stores/ares.js';
import { useFeaturesStore } from '$vue/stores/features.js';
import { usePlayerStore } from '$vue/stores/player.js';
import { useCurrentVillageStore } from '$vue/stores/village.js';
import { ipcSend } from '$global/ipc.js';
import { BrowserError } from '$browser/error.js';
import { setDevEvents } from '$browser/events/dev.js';
import { setPlunderEvents } from '$browser/events/plunder.js';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    // Pinia.
    const aresStore = useAresStore(pinia);
    const featuresStore = useFeaturesStore(pinia);
    const playerStore = usePlayerStore(pinia);
    const currentVillageStore = useCurrentVillageStore(pinia);

    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            aresStore.$patch(gameData.ares);
            featuresStore.$patch(gameData.features);
            playerStore.$patch(gameData.player);
            currentVillageStore.$patch(gameData.currentVillage);
            ipcSend('update-game-data', gameData);

        } catch (err) {
            BrowserError.catch(err);
        };
    });

    // Outros eventos.
    setDevEvents();
    setPlunderEvents(pinia);
};