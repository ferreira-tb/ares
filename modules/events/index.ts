import { ipcRenderer } from 'electron';
import { routeNames, router } from '$modules/router'; 
import { ModuleRouterError } from '$modules/error';
import {
    useAresStore,
    useCurrentVillageStore,
    useFeaturesStore,
    useGroupsStore,
    usePlayerStore,
    useSnobConfigStore,
    useUnitsStore
} from '$renderer/stores';

export function setModuleEvents() {
    const aresStore = useAresStore();
    const currentVillageStore = useCurrentVillageStore();
    const featuresStore = useFeaturesStore();
    const groupsStore = useGroupsStore();
    const playerStore = usePlayerStore();
    const snobConfigStore = useSnobConfigStore();
    const unitStore = useUnitsStore();

    ipcRenderer.once('module:set-route', async (_e, name: ModuleRoutes) => {
        try {
            if (!routeNames.includes(name)) {
                throw new ModuleRouterError(`${name} is not a valid route name.`);
            };
            await router.push({ name });
        } catch (err) {
            ModuleRouterError.catch(err);
        };
    });

    ipcRenderer.on('game:patch-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
    ipcRenderer.on('game:patch-village-groups-set', (_e, all: Set<VillageGroup>) => groupsStore.$patch({ all }));
    ipcRenderer.on('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));

    ipcRenderer.on('game:patch-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
        groupsStore.$patch(data.groups);
    });
};