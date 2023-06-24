import { ipcMain } from 'electron';
import { ref, storeToRefs, watchImmediate } from 'mechanus';
import { useCacheStore } from '$electron/stores';
import { setWorldConfigEvents } from '$electron/events/world/config';
import { setWorldDataEvents } from '$electron/events/world/data';
import { setWorldUnitsEvents } from '$electron/events/world/units';
import { WorldConfig, WorldUnits } from '$electron/database/models';
import { isWorld } from '$common/guards';

export function setWorldEvents() {
    const cacheStore = useCacheStore();
    const { world: cachedWorld } = storeToRefs(cacheStore);

    ipcMain.handle('world:current', (): World | null => cachedWorld.value);

    ipcMain.handle('world:get-config', async (_e, world: World | null = null): Promise<WorldConfigType | null> => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return null;

        const worldConfig = (await WorldConfig.findByPk(world))?.toJSON();
        return worldConfig ?? null;
    });

    ipcMain.handle('world:get-units-info', async (_e, world: World | null = null): Promise<WorldUnitsType | null> => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return null;

        const worldUnits = (await WorldUnits.findByPk(world))?.toJSON();
        return worldUnits ?? null;
    });
    
    ipcMain.handle('world:is-archer-world', isArcherWorldHandler(cachedWorld));

    setWorldConfigEvents(cachedWorld);
    setWorldDataEvents(cachedWorld);
    setWorldUnitsEvents(cachedWorld);
}

function isArcherWorldHandler(cachedWorld: MechanusRef<World | null>) {
    const isArcherWorld = ref<boolean | null>(null);
    watchImmediate(cachedWorld, async (world) => {
        if (!isWorld(world)) {
            isArcherWorld.value = null;
            return;
        }

        const worldConfig = await WorldConfig.findByPk(world);
        isArcherWorld.value = worldConfig?.archer ?? null;
    });

    return function(): boolean | null {
        return isArcherWorld.value;
    };
}