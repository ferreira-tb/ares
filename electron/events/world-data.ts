import { Op } from 'sequelize';
import { ipcMain } from 'electron';
import { getVillagesTable, useCacheStore } from '$electron/interface';
import { isWorld } from '$common/guards';

export function setWorldDataEvents() {
    const cacheStore = useCacheStore();

    // Obtêm informações sobre uma ou mais aldeias.
    // Se o id da aldeia não for especificado, retorna todas as aldeias do mundo.
    ipcMain.handle('world-data:get-villages', async (_e, villageId?: number[] | number, world: World | null = null) => {
        world ??= cacheStore.world;
        if (!isWorld(world)) return [];

        const VillagesTable = await getVillagesTable(world);
        if (!villageId) return (await VillagesTable.findAll()).map((v) => v.toJSON());

        const idList = Array.isArray(villageId) ? villageId : [villageId];
        if (idList.length === 0) return [];

        const villages = await VillagesTable.findAll({
            where: { [Op.or]: idList.map((id) => ({ id })) }
        });
        
        return villages.map((v) => v.toJSON());
    });

    // Obtêm uma lista com todas as aldeias de um jogador.
    ipcMain.handle('world-data:get-player-villages', async (_e, player: number, world: World | null = null) => {
        world ??= cacheStore.world;
        if (!isWorld(world)) return [];

        const VillagesTable = await getVillagesTable(world);
        const villages = await VillagesTable.findAll({ where: { player } });
        return villages.map((v) => v.toJSON());
    });
};