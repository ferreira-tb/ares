import { Op } from 'sequelize';
import { ipcMain, MessageChannelMain, utilityProcess } from 'electron';
import { watch } from 'mechanus';
import { Kronos } from '@tb-dev/kronos';
import { sequelize } from '$electron/database';
import { childProcess } from '$electron/utils/files';
import { MainProcessError } from '$electron/error';
import { isWorld } from '$common/guards';
import {
    getAlliesTable,
    getPlayersTable,
    getVillagesTable,
    WorldDataFetchHistory
} from '$electron/database/models';

export function setWorldDataEvents(cachedWorld: MechanusRef<World | null>) {
    // Obtêm informações sobre uma ou mais aldeias.
    // Se o id da aldeia não for especificado, retorna todas as aldeias do mundo.
    ipcMain.handle('world-data:get-village', async (
        _e, villageId?: number | number[] | null, world: World | null = null
    ) => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return [];

        const VillagesTable = await getVillagesTable(world);
        if (!villageId || (Array.isArray(villageId) && villageId.length === 0)) {
            return (await VillagesTable.findAll()).map((v) => v.toJSON());
        }

        const idList = Array.isArray(villageId) ? villageId : [villageId];
        const villages = await VillagesTable.findAll({
            where: { [Op.or]: idList.map((id) => ({ id })) }
        });
        
        return villages.map((v) => v.toJSON());
    });

    // Obtêm uma lista com todas as aldeias de um jogador.
    ipcMain.handle('world-data:get-player-villages', async (
        _e, player: number | number[], world: World | null = null
    ) => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return [];

        player = Array.isArray(player) ? player : [player];

        const VillagesTable = await getVillagesTable(world);
        const villages = await VillagesTable.findAll({ 
            where: { [Op.or]: player.map((id) => ({ player: id })) }
        });

        return villages.map((v) => v.toJSON());
    });

    // Obtêm informações sobre uma ou mais tribos.
    // Se o id da tribo não for especificado, retorna todas as tribos do mundo.
    ipcMain.handle('world-data:get-ally', async (
        _e, allyId?: number | number[] | null, world: World | null = null
    ) => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return [];

        const AlliesTable = await getAlliesTable(world);
        if (!allyId || (Array.isArray(allyId) && allyId.length === 0)) {
            return (await AlliesTable.findAll()).map((a) => a.toJSON());
        }

        const idList = Array.isArray(allyId) ? allyId : [allyId];
        const allies = await AlliesTable.findAll({
            where: { [Op.or]: idList.map((id) => ({ id })) }
        });

        return allies.map((a) => a.toJSON());
    });

    // Obtêm uma lista com todas os jogadores de uma tribo.
    ipcMain.handle('world-data:get-ally-players', async (
        _e, ally: number | number[], world: World | null = null
    ) => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return [];

        ally = Array.isArray(ally) ? ally : [ally];

        const PlayersTable = await getPlayersTable(world);
        const players = await PlayersTable.findAll({
            where: { [Op.or]: ally.map((id) => ({ ally: id })) }
        });

        return players.map((p) => p.toJSON());
    });

    // Obtêm uma lista com todas as aldeias de uma tribo.
    ipcMain.handle('world-data:get-ally-villages', async (
        _e, ally: number | number[], world: World | null = null
    ) => {
        world ??= cachedWorld.value;
        if (!isWorld(world)) return [];

        ally = Array.isArray(ally) ? ally : [ally];

        const PlayersTable = await getPlayersTable(world);
        const players = (await PlayersTable.findAll({
            where: { [Op.or]: ally.map((id) => ({ ally: id })) }
        }) as unknown) as WorldPlayersModel[];

        if (players.length === 0) return [];

        const VillagesTable = await getVillagesTable(world);
        const villages = await VillagesTable.findAll({
            where: { [Op.or]: players.map((p) => ({ player: p.id })) }
        });

        return villages.map((v) => v.toJSON());
    });

    // Obtêm informações do mundo sempre que ele for alterado.
    watch(cachedWorld, fetchWorldData());
}

function fetchWorldData() {
    return async function(world: World | null) {
        if (!isWorld(world)) return;
        try {
            const now = Date.now();
            const worldData = await WorldDataFetchHistory.findByPk(world);

            // O dados são atualizados a cada 24 horas.
            const request: WorldDataRequest = {
                ally: worldData?.ally ? (now - worldData.ally) <= Kronos.Day : true,
                player: worldData?.player ? (now - worldData.player) <= Kronos.Day : true,
                village: worldData?.village ? (now - worldData.village) <= Kronos.Day : true,
                world
            };

            // Retorna se não for necessário atualizar os dados.
            if (!Object.values(request).some((value) => value === true)) return;

            const newData = await new Promise<WorldDataType | null>((resolve, reject) => {
                const { port1, port2 } = new MessageChannelMain();
                const child = utilityProcess.fork(childProcess.fetchWorldData);
                child.postMessage(request, [port2]);

                port1.on('message', (e) => {
                    try {
                        if (!e.data) {
                            throw new MainProcessError(`No data received for world ${world}.`);
                        }
                        resolve(e.data);
                    } catch (err) {
                        reject(err);
                    } finally {
                        port1.close();
                        child.kill();
                    }
                });

                port1.start();
            });

            if (newData) {
                await sequelize.transaction(async () => {
                    const history: PartialWorldDataFetchHistory = {};
                    if (newData.allies.length > 0) {
                        const Allies = await getAlliesTable(world);
                        await Allies.bulkCreate(newData.allies, {
                            updateOnDuplicate: ['name', 'tag', 'members', 'villages', 'points', 'allPoints', 'rank']
                        });

                        history.ally = Date.now();
                    }

                    if (newData.players.length > 0) {
                        const Players = await getPlayersTable(world);
                        await Players.bulkCreate(newData.players, {
                            updateOnDuplicate: ['name', 'ally', 'villages', 'points', 'rank']
                        });

                        history.player = Date.now();
                    }

                    if (newData.villages.length > 0) {
                        const Villages = await getVillagesTable(world);
                        await Villages.bulkCreate(newData.villages, {
                            updateOnDuplicate: ['name', 'player', 'points']
                        });
                        
                        history.village = Date.now();
                    }
                    
                    if (Object.keys(history).length > 0) {
                        await WorldDataFetchHistory.upsert({ world, ...history });
                    }
                });
                
            } else {
                throw new MainProcessError(`No data received for world ${world}.`);
            }

        } catch (err) {
            MainProcessError.catch(err);
        }
    };
}