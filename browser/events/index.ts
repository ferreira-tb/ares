import { ipcRenderer } from 'electron';
import { Deimos } from '$deimos/shared/ipc';
import { useAresStore } from '$global/stores/ares';
import { useFeaturesStore } from '$global/stores/features';
import { useGroupsStore } from '$global/stores/groups';
import { usePlayerStore } from '$global/stores/player';
import { useCurrentVillageStore } from '$global/stores/village';
import { ipcSend } from '$global/ipc';
import { BrowserError } from '$browser/error';
import { setDevEvents } from '$browser/events/dev';
import { setPlunderEvents } from '$browser/events/plunder';
import type { Pinia } from 'pinia';

export function setBrowserEvents(pinia: Pinia) {
    // Pinia.
    const aresStore = useAresStore(pinia);
    const featuresStore = useFeaturesStore(pinia);
    const groupsStore = useGroupsStore(pinia);
    const playerStore = usePlayerStore(pinia);
    const currentVillageStore = useCurrentVillageStore(pinia);
    
    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (gameData === null) return;

            ipcSend('update-game-data', gameData);
            aresStore.$patch(gameData.ares);
            featuresStore.$patch(gameData.features);
            groupsStore.$patch(gameData.groups);
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