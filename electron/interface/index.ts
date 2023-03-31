import { Mechanus, watch, storeToRefs } from 'mechanus';

import { UserConfig } from '$tables/config';
import { ErrorLog, DOMErrorLog, MainProcessErrorLog } from '$tables/error';
import { PlunderHistory, PlunderConfig, CustomPlunderTemplate, DemolitionTemplate } from '$tables/plunder';
import { User } from '$tables/user';
import { WorldConfig, WorldUnit } from '$tables/world';
import { VillageGroups } from '$tables/groups';

import { definePlunderStore, definePlunderConfigStore, setPlunderHistoryStores, definePlunderCacheStore } from '$stores/plunder';
import { defineAresStore } from '$stores/ares';
import { defineCacheStore } from '$stores/cache';
import { defineUnitsStore } from '$stores/units';
import { defineFeaturesStore } from '$stores/features';
import { definePlayerStore } from '$stores/player';
import { defineWorldConfigStore, createWorldUnitStoresMap } from '$stores/world';
import { defineCurrentVillageStore } from '$stores/village';
import { defineGroupsStore } from '$stores/groups';
import { defineBrowserViewStore } from '$stores/view';

import { patchAliasRelatedStores } from '$interface/alias';
import { patchWorldRelatedStores } from '$interface/world';
import { catchError } from '$interface/error';

import { MainProcessError } from '$electron/error';

export const mechanus = new Mechanus();

export const useAresStore = defineAresStore(mechanus);
export const usePlunderStore = definePlunderStore(mechanus);
export const usePlunderConfigStore = definePlunderConfigStore(mechanus);
export const { useLastPlunderHistoryStore, useTotalPlunderHistoryStore } = setPlunderHistoryStores(mechanus);
export const usePlunderCacheStore = definePlunderCacheStore(mechanus);
export const useFeaturesStore = defineFeaturesStore(mechanus);
export const useUnitsStore = defineUnitsStore(mechanus);
export const usePlayerStore = definePlayerStore(mechanus);
export const useCurrentVillageStore = defineCurrentVillageStore(mechanus);
export const useWorldConfigStore = defineWorldConfigStore(mechanus);
export const worldUnitsMap = createWorldUnitStoresMap(mechanus);
export const useGroupsStore = defineGroupsStore(mechanus);
export const useCacheStore = defineCacheStore(mechanus);
export const useBrowserViewStore = defineBrowserViewStore(mechanus);

const worldArgs = [
    WorldConfig,
    WorldUnit,
    useWorldConfigStore,
    worldUnitsMap
] as const;

const aliasArgs = [
    PlunderConfig,
    PlunderHistory,
    usePlunderConfigStore,
    useLastPlunderHistoryStore,
    useTotalPlunderHistoryStore,

    VillageGroups,
    useGroupsStore
] as const;

////// ERROS
MainProcessError.catch = catchError(useAresStore(), MainProcessErrorLog);

////// WATCHERS
const { name: playerName } = storeToRefs(usePlayerStore());
watch(playerName, (name) => User.savePlayerAsUser(name));

// Essas funções retornam outras funções, que, por sua vez, serão usadas como callbacks.
const { world, userAlias } = storeToRefs(useCacheStore());
watch(world, patchWorldRelatedStores(...worldArgs));
watch(userAlias, patchAliasRelatedStores(...aliasArgs));

const { screen } = storeToRefs(useAresStore());
const { currentVillage: plunderCurrentVillage, plunderGroup } = storeToRefs(usePlunderCacheStore());
watch(screen, (screen) => {
    try {
        if (screen !== 'am_farm') {
            if (plunderCurrentVillage.value) plunderCurrentVillage.value = null;
            if (plunderGroup.value) plunderGroup.value = null;
        };
    } catch (error) {
        MainProcessError.catch(error);
    };
});

export {
    UserConfig,
    ErrorLog,
    DOMErrorLog,
    MainProcessErrorLog,
    PlunderHistory,
    PlunderConfig,
    CustomPlunderTemplate,
    DemolitionTemplate,
    User,
    WorldConfig,
    WorldUnit,
    VillageGroups
};