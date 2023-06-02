import { WorldInterfaceError } from '$electron/error';
import { TribalWorker } from '$electron/worker';
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
                const worker = new TribalWorker('fetch-world-config', url, { override: true });
                await worker.init((e) => {
                    try {
                        if (!e.data) throw new WorldInterfaceError(`No data received for world ${world}.`);
                        resolve(e.data);
                    } catch (err) {
                        reject(err);
                    } finally {
                        worker.destroy();
                    };
                });
            });

            // Salva o registro no banco de dados.
            worldConfig = await sequelize.transaction(async () => {
                return (await WorldConfig.create({ id: world, ...state })).toJSON();
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