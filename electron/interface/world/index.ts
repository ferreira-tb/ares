import { isWorld } from '$global/guards';
import { WorldPatchError } from '$electron/error';
import { patchWorldConfigStoreState } from '$interface/world/config';
import { patchWorldUnitsStoresState } from '$interface/world/units';
import type { World } from '$types/game';
import type { WorldConfig as WorldConfigTable, WorldUnits as WorldUnitsTable } from '$electron/database/world';
import type { defineWorldConfigStore, createWorldUnitStoresMap } from '$stores/world';
import type { defineCacheStore } from '$stores/cache';

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
                patchWorldConfigStoreState(world, WorldConfig, useCacheStore, useWorldConfigStore),
                patchWorldUnitsStoresState(world, WorldUnits, useCacheStore, worldUnitsMap)
            ]);
        } catch (err) {
            WorldPatchError.catch(err);
        };
    };
};