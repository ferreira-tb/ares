import { Mechanus } from 'mechanus';
import { defineCacheStore } from '$electron/stores/cache';
import { defineUnitsStore } from '$electron/stores/units';
import {
    defineGameDataStore,
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

export const useCacheStore = defineCacheStore(mechanus);
export const useGameDataStore = defineGameDataStore(mechanus);
export const useIncomingsStore = defineIncomingsStore(mechanus);
export const usePlunderStore = definePlunderStore(mechanus);
export const usePlunderConfigStore = definePlunderConfigStore(mechanus);
export const usePlunderHistoryStore = definePlunderHistoryStore(mechanus);
export const usePlunderCacheStore = definePlunderCacheStore(mechanus);
export const useUnitsStore = defineUnitsStore(mechanus);