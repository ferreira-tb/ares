// O propósito dessa interface é impedir que surjam dependências circulares.
import { Mechanus, watch, storeToRefs } from 'mechanus';

import {
    ErrorLog,
    ElectronErrorLog,
    PlunderHistory,
    PlunderConfig,
    CustomPlunderTemplate,
    DemolitionTemplate,
    getPlayersTable,
    getVillagesTable,
    WorldConfig,
    WorldUnits,
    WorldDataFetchHistory,
    SnobConfig,
    SnobHistory,
    VillageGroups
} from '$electron/database/models';

import {
    createWorldUnitStoresMap,
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

import { onAliasChange } from '$electron/interface/alias';
import { onWorldChange } from '$electron/interface/world';
import { catchError } from '$electron/interface/error';

import { MainProcessError } from '$electron/error';

export const mechanus = new Mechanus();

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
MainProcessError.catch = catchError(ElectronErrorLog);

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
    ErrorLog,
    ElectronErrorLog,
    PlunderHistory,
    PlunderConfig,
    CustomPlunderTemplate,
    DemolitionTemplate,
    SnobConfig,
    SnobHistory,
    WorldDataFetchHistory,
    WorldConfig,
    WorldUnits,
    VillageGroups,

    getPlayersTable,
    getVillagesTable
};