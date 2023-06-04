import { Mechanus, watch, storeToRefs } from 'mechanus';

import { AppConfig } from '$database/config';
import { ErrorLog, ElectronErrorLog } from '$database/error';
import { PlunderHistory, PlunderConfig, CustomPlunderTemplate, DemolitionTemplate } from '$database/plunder';
import { getPlayersTable, getVillagesTable, WorldConfig, WorldUnits, WorldDataFetchHistory } from '$database/world';
import { VillageGroups } from '$database/groups';

import { 
    createWorldUnitStoresMap,
    defineAppGeneralConfigStore,
    defineAppNotificationsStore,
    defineAresStore,
    defineBrowserViewStore,
    defineCacheStore,
    defineCurrentVillageStore,
    defineFeaturesStore,
    defineGroupsStore,
    defineIncomingsStore,
    definePlayerStore,
    definePlunderStore,
    definePlunderCacheStore,
    definePlunderConfigStore,
    definePlunderHistoryStore,
    defineUnitsStore,
    defineWorldConfigStore
} from '$electron/stores';

import { onAliasChange } from '$interface/alias';
import { onWorldChange } from '$interface/world';
import { catchError } from '$interface/error';

import { MainProcessError } from '$electron/error';

export const mechanus = new Mechanus();

export const useAppGeneralConfigStore = defineAppGeneralConfigStore(mechanus);
export const useAppNotificationsStore = defineAppNotificationsStore(mechanus);
export const useAresStore = defineAresStore(mechanus);
export const useBrowserViewStore = defineBrowserViewStore(mechanus);
export const useCacheStore = defineCacheStore(mechanus);
export const useCurrentVillageStore = defineCurrentVillageStore(mechanus);
export const useFeaturesStore = defineFeaturesStore(mechanus);
export const useGroupsStore = defineGroupsStore(mechanus);
export const useIncomingsStore = defineIncomingsStore(mechanus);
export const usePlayerStore = definePlayerStore(mechanus);
export const usePlunderStore = definePlunderStore(mechanus);
export const usePlunderConfigStore = definePlunderConfigStore(mechanus);
export const usePlunderHistoryStore = definePlunderHistoryStore(mechanus);
export const usePlunderCacheStore = definePlunderCacheStore(mechanus);
export const useUnitsStore = defineUnitsStore(mechanus);
export const useWorldConfigStore = defineWorldConfigStore(mechanus);
export const worldUnitsMap = createWorldUnitStoresMap(mechanus);

const worldArgs = [
    WorldDataFetchHistory,
    WorldConfig,
    WorldUnits,
    useCacheStore,
    useWorldConfigStore,
    worldUnitsMap,
    getPlayersTable,
    getVillagesTable
] as const;

const aliasArgs = [
    PlunderConfig,
    PlunderHistory,
    usePlunderConfigStore,
    usePlunderHistoryStore,

    VillageGroups,
    useGroupsStore
] as const;

// ERROS
MainProcessError.catch = catchError(useAppNotificationsStore(), ElectronErrorLog);

// WATCHERS
// Essas funções retornam outras funções, que, por sua vez, são usadas como callbacks.
const { world, userAlias } = storeToRefs(useCacheStore());
watch(world, onWorldChange(...worldArgs));
watch(userAlias, onAliasChange(...aliasArgs));

const { screen } = storeToRefs(useAresStore());
const { pages: plunderPages, plunderGroup } = storeToRefs(usePlunderCacheStore());
watch(screen, (newScreen) => {
    try {
        if (newScreen !== 'am_farm') {
            if (plunderPages.value) plunderPages.value = null;
            if (plunderGroup.value) plunderGroup.value = null;
        };
    } catch (error) {
        MainProcessError.catch(error);
    };
});

export {
    AppConfig,
    ErrorLog,
    ElectronErrorLog,
    PlunderHistory,
    PlunderConfig,
    CustomPlunderTemplate,
    DemolitionTemplate,
    WorldDataFetchHistory,
    WorldConfig,
    WorldUnits,
    VillageGroups,

    getPlayersTable,
    getVillagesTable
};