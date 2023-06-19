import { router } from '$windows/router'; 
import { ipcOn, ipcOnce } from '$renderer/ipc';
import { RendererProcessError } from '$renderer/error';
import type { StandardWindowName } from '$common/enum';
import {
    useGameDataStore,
    usePlunderConfigStore,
    useSnobConfigStore,
    useUnitsStore
} from '$renderer/stores';

export function setModuleEvents() {
    const gameDataStore = useGameDataStore();
    const plunderConfigStore = usePlunderConfigStore();
    const snobConfigStore = useSnobConfigStore();
    const unitStore = useUnitsStore();

    ipcOnce('window:set-route', async (_e, name: StandardWindowName) => {
        try {
            await router.push({ name });
        } catch (err) {
            RendererProcessError.catch(err);
        };
    });

    ipcOn('game:patch-game-data', (_e, data: TribalWarsGameDataType) => gameDataStore.$patch(data));
    ipcOn('game:patch-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
    ipcOn('plunder:patch-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcOn('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));
};