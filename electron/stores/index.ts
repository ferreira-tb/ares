import { Mechanus } from 'mechanus';
import { defineCacheStore } from '$electron/stores/cache';
import {
    defineBrowserStore,
    defineGameDataStore,
    defineIncomingsStore,
    definePlunderConfigStore,
    definePlunderHistoryStore,
    definePlunderCacheStore,
    defineUnitsStore
} from '$common/stores';

// Electron Store
export * from '$electron/stores/config';

// Mechanus
export const mechanus = new Mechanus();

export const useBrowserStore = defineBrowserStore(mechanus);
export const useCacheStore = defineCacheStore(mechanus);
export const useGameDataStore = defineGameDataStore(mechanus);
export const useIncomingsStore = defineIncomingsStore(mechanus);
export const usePlunderConfigStore = definePlunderConfigStore(mechanus);
export const usePlunderHistoryStore = definePlunderHistoryStore(mechanus);
export const usePlunderCacheStore = definePlunderCacheStore(mechanus);
export const useUnitsStore = defineUnitsStore(mechanus);