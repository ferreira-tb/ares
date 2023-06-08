import { isWorld } from '$common/guards';
import { WorldInterfaceError } from '$electron/error';
import { fetchWorldData } from '$electron/interface/world/data';
import { patchWorldConfigStoreState } from '$electron/interface/world/config';
import { patchWorldUnitsStoresState } from '$electron/interface/world/units';
import type { defineCacheStore, defineWorldConfigStore, createWorldUnitStoresMap } from '$electron/stores';
 
import type {
    WorldConfig as WorldConfigTable,
    WorldUnits as WorldUnitsTable,
    WorldDataFetchHistory as WorldDataFetchHistoryTable,
    getPlayersTable as getWorldPlayersTableType,
    getVillagesTable as getWorldVillagesTableType
} from '$electron/database/models/world';

export function onWorldChange(
    WorldDataFetchHistory: typeof WorldDataFetchHistoryTable,
    WorldConfig: typeof WorldConfigTable,
    WorldUnits: typeof WorldUnitsTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>,
    getPlayersTable: typeof getWorldPlayersTableType,
    getVillagesTable: typeof getWorldVillagesTableType
) {
    return async function(world: World | null) {
        try {
            if (!isWorld(world)) return;
            await Promise.all([
                fetchWorldData(world, WorldDataFetchHistory, getPlayersTable, getVillagesTable),
                patchWorldConfigStoreState(world, WorldConfig, useCacheStore, useWorldConfigStore),
                patchWorldUnitsStoresState(world, WorldUnits, useCacheStore, worldUnitsMap)
            ]);
        } catch (err) {
            WorldInterfaceError.catch(err);
        };
    };
};