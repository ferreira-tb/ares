import { ipcRenderer } from 'electron';
import { BrowserError } from '$browser/error';
import { ipcSend } from '$renderer/ipc';
import { IpcTribal } from '$ipc/interface';
import {
    useAresStore,
    useFeaturesStore,
    useGroupsStore,
    usePlayerStore,
    useCurrentVillageStore
} from '$renderer/stores';

export function setIpcTribalEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const groupsStore = useGroupsStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();

    ipcRenderer.on('get-game-data', async () => {
        try {
            const gameData = await IpcTribal.invoke('get-game-data');
            if (!gameData) return;
    
            ipcSend('ipc-tribal:update-game-data', gameData);
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