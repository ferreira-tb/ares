import { ipcMain } from 'electron';
import { useCacheStore, usePlayerStore } from '$electron/stores';

export function setPlayerEvents() {
    const cacheStore = useCacheStore();
    const playerStore = usePlayerStore();

    ipcMain.handle('player:name', (): string | null => cacheStore.player);
    ipcMain.handle('player:get-store', (): PlayerStore => ({ ...playerStore }));
};