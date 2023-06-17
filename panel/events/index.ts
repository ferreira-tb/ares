import { setPlunderEvents } from '$panel/events/plunder';
import { setSnobEvents } from '$panel/events/snob';
import { ipcOn } from '$renderer/ipc';
import { useCacheStore, useGameDataStore, useUnitsStore } from '$renderer/stores';

export function setPanelEvents() {
    const cacheStore = useCacheStore();
    const gameDataStore = useGameDataStore();
    const unitStore = useUnitsStore();

    ipcOn('captcha:did-update-status', (_e, status: boolean) => {
        cacheStore.captcha = status;
    });

    ipcOn('game:patch-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
    ipcOn('game:patch-game-data', (_e, data: TribalWarsGameDataType) => gameDataStore.$patch(data));

    setPlunderEvents();
    setSnobEvents();
};