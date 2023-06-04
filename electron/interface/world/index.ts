import { isWorld } from '$shared/guards';
import { WorldInterfaceError } from '$electron/error';
import { fetchWorldData } from '$interface/world/data';
import { patchWorldConfigStoreState } from '$interface/world/config';
import { patchWorldUnitsStoresState } from '$interface/world/units';
import type { defineCacheStore, defineWorldConfigStore, createWorldUnitStoresMap } from '$electron/stores';
 
import type {
    WorldConfig as WorldConfigTable,
    WorldUnits as WorldUnitsTable,
    WorldDataFetchHistory as WorldDataFetchHistoryTable,
    getWorldVillagesTable as getWorldVillagesTableType
} from '$electron/database/world';

export function onWorldChange(
    WorldDataFetchHistory: typeof WorldDataFetchHistoryTable,
    WorldConfig: typeof WorldConfigTable,
    WorldUnits: typeof WorldUnitsTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>,
    getWorldVillagesTable: typeof getWorldVillagesTableType
) {
    return async function(world: World | null) {
        try {
            if (!isWorld(world)) return;
            await Promise.all([
                fetchWorldData(world, WorldDataFetchHistory, getWorldVillagesTable),
                patchWorldConfigStoreState(world, WorldConfig, useCacheStore, useWorldConfigStore),
                patchWorldUnitsStoresState(world, WorldUnits, useCacheStore, worldUnitsMap)
            ]);
        } catch (err) {
            WorldInterfaceError.catch(err);
        };
    };
};