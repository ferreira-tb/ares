import { BrowserError } from '$browser/error';
import { ipcOn, ipcSend } from '$renderer/ipc';
import { IpcTribal } from '$ipc/interface';
import {
    useAresStore,
    useFeaturesStore,
    usePlayerStore,
    useCurrentVillageStore
} from '$renderer/stores';

export function setIpcTribalEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();

    ipcOn('get-game-data', async () => {
        try {
            const gameData = await IpcTribal.invoke('get-game-data');
            ipcSend('ipc-tribal:update-game-data', gameData);
            if (!gameData) return;
            
            aresStore.$patch(gameData.ares);
            featuresStore.$patch(gameData.features);
            playerStore.$patch(gameData.player);
            currentVillageStore.$patch(gameData.currentVillage);
            
        } catch (err) {
            BrowserError.catch(err);
        };
    });
};