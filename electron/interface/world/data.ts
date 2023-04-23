import { MessageChannelMain, utilityProcess } from 'electron';
import { sequelize } from '$electron/database';
import { Kronos } from '$global/constants';
import { childProcess } from '$electron/utils/files';
import { WorldInterfaceError } from '$electron/error';
import type { World } from '$types/game';
import type { WorldDataType } from '$types/world';
import type {
    WorldDataFetchHistory as WorldDataFetchHistoryTable,
    getWorldVillagesTable as getWorldVillagesTableType
} from '$electron/database/world';

export async function fetchWorldData(
    world: World,
    WorldDataFetchHistory: typeof WorldDataFetchHistoryTable,
    getWorldVillagesTable: typeof getWorldVillagesTableType
) {
    try {
        const worldData = await WorldDataFetchHistory.findByPk(world);
        if (worldData?.village && ((Date.now() - worldData.village) <= Kronos.Day)) return;

        const newData = await new Promise<WorldDataType | string>((resolve, reject) => {
            const { port1, port2 } = new MessageChannelMain();
            const child = utilityProcess.fork(childProcess.worldData);
            child.postMessage(world, [port2]);

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

        if (newData && typeof newData === 'object') {
            await sequelize.transaction(async (transaction) => {
                const WorldVillages = await getWorldVillagesTable(world);
                await WorldVillages.bulkCreate(newData.villages, { updateOnDuplicate: ['name', 'player', 'points'], transaction });
                await WorldDataFetchHistory.upsert({ world, village: Date.now() }, { transaction });
            });

        } else if (typeof newData === 'string') {
            throw new WorldInterfaceError(newData);
        };

    } catch (err) {
        if (err instanceof Error) throw err;
    };
};