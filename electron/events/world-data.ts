import { Op } from 'sequelize';
import { ipcMain } from 'electron';
import { getWorldVillagesTable, useCacheStore } from '$electron/interface';
import { isWorld } from '$shared/guards';

export function setWorldDataEvents() {
    const cacheStore = useCacheStore();

    ipcMain.handle('world-data:get-village', async (_e, villageId?: number[] | number, world: World | null = null) => {
        world ??= cacheStore.world;
        if (!isWorld(world)) return [];

        const VillagesTable = await getWorldVillagesTable(world);
        if (!villageId) return (await VillagesTable.findAll()).map((v) => v.toJSON());

        const idList = Array.isArray(villageId) ? villageId : [villageId];
        if (idList.length === 0) return [];

        const villages = await VillagesTable.findAll({
            where: { [Op.or]: idList.map((id) => ({ id })) }
        });
        return villages.map((v) => v.toJSON());
    });
};