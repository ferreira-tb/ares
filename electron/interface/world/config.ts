import { MessageChannelMain } from 'electron';
import { WorldInterfaceError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { getWorldConfigUrl } from '$shared/helpers';
import { sequelize } from '$electron/database';
import type {
    WorldConfig as WorldConfigTable,
    useCacheStore as useCacheStoreType,
    useWorldConfigStore as useWorldConfigStoreType
} from '$electron/interface';

export async function patchWorldConfigStoreState<T extends keyof WorldConfigType>(
    world: World,
    WorldConfig: typeof WorldConfigTable,
    useCacheStore: typeof useCacheStoreType,
    useWorldConfigStore: typeof useWorldConfigStoreType
) {
    try {
        const cacheStore = useCacheStore();
        const worldConfigStore = useWorldConfigStore();

        let worldConfig = (await WorldConfig.findByPk(world))?.toJSON();
        if (!worldConfig) {
            // Se não houver configurações para o mundo atual, cria um novo registro.
            const state = await new Promise<WorldConfigType>(async (resolve, reject) => {
                const url = getWorldConfigUrl(world, cacheStore.region);
                const phobos = await createPhobos('fetch-world-config', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'fetch-world-config' } satisfies PhobosPortMessage);
    
                port1.on('message', (e) => {
                    try {
                        if (!e.data) throw new WorldInterfaceError(`No data received for world ${world}.`);
                        resolve(e.data);
                    } catch (err) {
                        reject(err);
                    } finally {
                        port1.close();
                        destroyPhobos(phobos);
                    };
                });
    
                port1.start();
            });

            // Salva o registro no banco de dados.
            worldConfig = await sequelize.transaction(async (transaction) => {
                return (await WorldConfig.create({ id: world, ...state }, { transaction })).toJSON();
            });
        };
    
        for (const [key, value] of Object.entries(worldConfig) as [T, WorldConfigType[T]][]) {
            if (key in worldConfigStore) {
                worldConfigStore[key] = value;
            };
        };

    } catch (err) {
        WorldInterfaceError.catch(err);
    };
};