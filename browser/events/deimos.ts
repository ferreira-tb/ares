import { ipcRenderer } from 'electron';
import { useAresStore } from '$renderer/stores/ares';
import { useFeaturesStore } from '$renderer/stores/features';
import { useGroupsStore } from '$renderer/stores/groups';
import { usePlayerStore } from '$renderer/stores/player';
import { useCurrentVillageStore } from '$renderer/stores/village';
import { BrowserError } from '$browser/error';
import { ipcSend } from '$renderer/ipc';
import { Deimos } from '$deimos/interface/ipc';

export function setDeimosEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const groupsStore = useGroupsStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();

    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await Deimos.invoke('get-game-data');
            if (!gameData) return;
    
            ipcSend('deimos:update-game-data', gameData);
            aresStore.$patch(gameData.ares);
            featuresStore.$patch(gameData.features);
            groupsStore.$patch(gameData.groups);
            playerStore.$patch(gameData.player);
            currentVillageStore.$patch(gameData.currentVillage);
            
        } catch (err) {
            BrowserError.catch(err);
        };
    });
};