import { routeNames, router } from '$modules/router'; 
import { ModuleRouterError } from '$modules/error';
import { ipcOn, ipcOnce } from '$renderer/ipc';
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

    ipcOnce('module:set-route', async (_e, name: ModuleRoutes) => {
        try {
            if (!routeNames.includes(name)) {
                throw new ModuleRouterError(`${name} is not a valid route name.`);
            };
            await router.push({ name });
        } catch (err) {
            ModuleRouterError.catch(err);
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