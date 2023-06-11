import { isWorld } from '$common/guards';
import { WorldInterfaceError } from '$electron/error';
import { patchWorldConfig } from '$electron/interface/world/config';
import { patchWorldUnits } from '$electron/interface/world/units';
import type { defineCacheStore, defineWorldConfigStore, createWorldUnitStoresMap } from '$electron/stores';
import type { WorldConfig as WorldConfigTable, WorldUnits as WorldUnitsTable } from '$electron/database/models/world';

export function onWorldChange(
    WorldConfig: typeof WorldConfigTable,
    WorldUnits: typeof WorldUnitsTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>
) {
    return async function(world: World | null) {
        try {
            if (!isWorld(world)) return;
            await Promise.all([
                patchWorldConfig(world, WorldConfig, useCacheStore, useWorldConfigStore),
                patchWorldUnits(world, WorldUnits, useCacheStore, worldUnitsMap)
            ]);
        } catch (err) {
            WorldInterfaceError.catch(err);
        };
    };
};