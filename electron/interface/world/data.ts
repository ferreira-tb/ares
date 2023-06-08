import { MessageChannelMain, utilityProcess } from 'electron';
import { Kronos } from '@tb-dev/kronos';
import { sequelize } from '$electron/database';
import { childProcess } from '$electron/utils/files';
import { WorldInterfaceError } from '$electron/error';
import type {
    WorldDataFetchHistory as WorldDataFetchHistoryTable,
    getPlayersTable as getWorldPlayersTableType,
    getVillagesTable as getWorldVillagesTableType
} from '$electron/database/models/world';

export async function fetchWorldData(
    world: World,
    WorldDataFetchHistory: typeof WorldDataFetchHistoryTable,
    getPlayersTable: typeof getWorldPlayersTableType,
    getVillagesTable: typeof getWorldVillagesTableType
) {
    try {
        const now = Date.now();
        const worldData = await WorldDataFetchHistory.findByPk(world);

        const request: WorldDataRequest = {
            ally: false,
            player: worldData?.player ? (now - worldData.player) <= Kronos.Day : true,
            village: worldData?.village ? (now - worldData.village) <= Kronos.Day : true,
            world
        };

        if (!Object.values(request).some((value) => value === true)) return;
        const newData = await new Promise<WorldDataType | null>((resolve, reject) => {
            const { port1, port2 } = new MessageChannelMain();
            const child = utilityProcess.fork(childProcess.fetchWorldData);
            child.postMessage(request, [port2]);

            port1.on('message', (e) => {
                try {
                    if (!e.data) throw new WorldInterfaceError(`No data received for world ${world}.`);
                    resolve(e.data);
                } catch (err) {
                    reject(err);
                } finally {
                    port1.close();
                    child.kill();
                };
            });

            port1.start();
        });

        if (newData) {
            await sequelize.transaction(async () => {
                const history: PartialWorldDataFetchHistory = {};
                if (newData.players.length > 0) {
                    const Players = await getPlayersTable(world);
                    await Players.bulkCreate(newData.players, {
                        updateOnDuplicate: ['name', 'ally', 'villages', 'points', 'rank']
                    });

                    history.player = Date.now();
                };

                if (newData.villages.length > 0) {
                    const Villages = await getVillagesTable(world);
                    await Villages.bulkCreate(newData.villages, {
                        updateOnDuplicate: ['name', 'player', 'points']
                    });
                    
                    history.village = Date.now();
                };
                
                if (Object.keys(history).length > 0) {
                    await WorldDataFetchHistory.upsert({ world, ...history });
                };
            });
            
        } else {
            throw new WorldInterfaceError(`No data received for world ${world}.`);
        };

    } catch (err) {
        if (err instanceof Error) throw err;
    };
};