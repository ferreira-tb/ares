import { router } from '$windows/router'; 
import { ipcOn, ipcOnce } from '$renderer/ipc';
import { RendererProcessError } from '$renderer/error';
import type { StandardWindowName } from '$common/constants';
import {
    useAresStore,
    useCurrentVillageStore,
    useFeaturesStore,
    usePlayerStore,
    useSnobConfigStore,
    useUnitsStore
} from '$renderer/stores';

export function setModuleEvents() {
    const aresStore = useAresStore();
    const currentVillageStore = useCurrentVillageStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const snobConfigStore = useSnobConfigStore();
    const unitStore = useUnitsStore();

    ipcOnce('window:set-route', async (_e, name: StandardWindowName) => {
        try {
            await router.push({ name });
        } catch (err) {
            RendererProcessError.catch(err);
        };
    });

    ipcOn('game:patch-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
    ipcOn('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));

    ipcOn('game:patch-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
    });
};