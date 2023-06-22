import { ipcMain } from 'electron';
import { useCacheStore, useGameDataStore } from '$electron/stores';
import { setAllyEvents } from '$electron/events/game/ally';
import { setGroupsEvents } from '$electron/events/game/groups';
import { setIncomingAttacksEvents } from '$electron/events/game/incomings';
import { setPlunderEvents } from '$electron/events/game/plunder';
import { setSnobEvents } from '$electron/events/game/snob';
import { setUnitsEvents } from '$electron/events/game/units';

export function setGameEvents() {
    const cacheStore = useCacheStore();
    const gameDataStore = useGameDataStore();

    ipcMain.handle('game:data', (): TribalWarsGameDataType => gameDataStore.$raw());
    ipcMain.handle('player:name', (): string | null => cacheStore.player);

    setAllyEvents();
    setGroupsEvents();
    setIncomingAttacksEvents();
    setPlunderEvents();
    setSnobEvents();
    setUnitsEvents();
}