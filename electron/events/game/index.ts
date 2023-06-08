import { ipcMain } from 'electron';
import { worldUnitsMap, useCacheStore, useWorldConfigStore } from '$electron/interface';
import { extractWorldUnitsFromMap } from '$electron/utils/helpers';
import { setGroupsEvents } from '$electron/events/game/groups';
import { setIncomingAttacksEvents } from '$electron/events/game/incomings';
import { setSnobEvents } from '$electron/events/game/snob';

export function setGameEvents() {
    const cacheStore = useCacheStore();
    const worldConfigStore = useWorldConfigStore();

    ipcMain.handle('game:current-world', () => cacheStore.world);
    ipcMain.handle('game:current-world-config', () => ({ ...worldConfigStore }));
    ipcMain.handle('game:current-world-units', () => extractWorldUnitsFromMap(worldUnitsMap));
    ipcMain.handle('game:is-archer-world', () => worldConfigStore.archer);
    ipcMain.handle('game:player-name', () => cacheStore.player);

    // Outros eventos do jogo.
    setGroupsEvents();
    setIncomingAttacksEvents();
    setSnobEvents();
};