import { ipcMain } from 'electron';
import { isUserAlias } from '$shared/guards';
import { getPlayerNameFromAlias } from '$shared/helpers';
import { worldUnitsMap, useCacheStore, usePlayerStore, useWorldConfigStore } from '$electron/interface';
import { extractWorldUnitsFromMap } from '$electron/utils/helpers';

export function setGameEvents() {
    const cacheStore = useCacheStore();
    const playerStore = usePlayerStore();
    const worldConfigStore = useWorldConfigStore();

    ipcMain.handle('game:current-world', () => cacheStore.world);
    ipcMain.handle('game:current-world-config', () => ({ ...worldConfigStore }));
    ipcMain.handle('game:current-world-units', () => extractWorldUnitsFromMap(worldUnitsMap));
    ipcMain.handle('game:is-archer-world', () => worldConfigStore.archer);

    ipcMain.on('game:update-incoming-attacks', (_e, incomingAttacks: number) => {
        playerStore.incomings = incomingAttacks;
    });

    ipcMain.handle('game:player-name', (_e, alias: UserAlias): string | null => {
        if (!isUserAlias(alias)) return cacheStore.player;
        return getPlayerNameFromAlias(alias);
    });
};