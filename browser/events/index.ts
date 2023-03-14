import { ipcRenderer } from 'electron';
import { Deimos } from '$deimos/shared/ipc';
import { useAresStore } from '$vue/stores/ares';
import { useFeaturesStore } from '$vue/stores/features';
import { usePlayerStore } from '$vue/stores/player';
import { useCurrentVillageStore } from '$vue/stores/village';
import { ipcSend } from '$global/ipc';
import { BrowserError } from '$browser/error';
import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
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

            ipcSend('update-game-data', gameData);
            aresStore.$patch(gameData.ares);
            featuresStore.$patch(gameData.features);
            playerStore.$patch(gameData.player);
            currentVillageStore.$patch(gameData.currentVillage);
            
        } catch (err) {
            BrowserError.catch(err);
        };
    });

    // Outros eventos.
    setDevEvents();
    setPlunderEvents(pinia);
};