import { BrowserError } from '$browser/error';
import { ipcOn, ipcSend } from '$renderer/ipc';
import { IpcTribal } from '$ipc/interface';
import { useGameDataStore } from '$renderer/stores';

export function setIpcTribalEvents() {
    const gameDataStore = useGameDataStore();

    ipcOn('get-game-data', async () => {
        try {
            const gameData = await IpcTribal.invoke('ipc-tribal:game-data');
            ipcSend('ipc-tribal:update-game-data', gameData);

            if (!gameData) return; 
            gameDataStore.$patch(gameData);

        } catch (err) {
            BrowserError.catch(err);
        }
    });
}