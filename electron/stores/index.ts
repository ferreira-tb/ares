import { Mechanus } from 'mechanus';
import { defineAresStore } from '$electron/stores/ares';
import { defineCacheStore } from '$electron/stores/cache';
import { defineCurrentVillageStore } from '$electron/stores/village';
import { definePlayerStore } from '$electron/stores/player';
import { defineUnitsStore } from '$electron/stores/units';
import {
    defineFeaturesStore,
    defineIncomingsStore,
    definePlunderStore,
    definePlunderConfigStore,
    definePlunderHistoryStore,
    definePlunderCacheStore
} from '$electron/stores/game';

// Electron Store
export * from '$electron/stores/config';

// Mechanus
export const mechanus = new Mechanus();

export const useAresStore = defineAresStore(mechanus);
export const useCacheStore = defineCacheStore(mechanus);
export const useCurrentVillageStore = defineCurrentVillageStore(mechanus);
export const useFeaturesStore = defineFeaturesStore(mechanus);
export const useIncomingsStore = defineIncomingsStore(mechanus);
export const usePlayerStore = definePlayerStore(mechanus);
export const usePlunderStore = definePlunderStore(mechanus);
export const usePlunderConfigStore = definePlunderConfigStore(mechanus);
export const usePlunderHistoryStore = definePlunderHistoryStore(mechanus);
export const usePlunderCacheStore = definePlunderCacheStore(mechanus);
export const useUnitsStore = defineUnitsStore(mechanus);