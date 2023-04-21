import { MessageChannelMain } from 'electron';
import { isKeyOf } from '$global/guards';
import { WorldPatchError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { getWorldConfigUrl } from '$global/helpers';
import { sequelize } from '$electron/database';
import type { WorldConfigType } from '$types/world';
import type { PhobosPortMessage } from '$types/phobos';
import type { World } from '$types/game';
import type { WorldConfig as WorldConfigTable } from '$electron/database/world';
import type { defineWorldConfigStore } from '$stores/world';
import type { defineCacheStore } from '$stores/cache';

export async function patchWorldConfigStoreState(
    world: World,
    WorldConfig: typeof WorldConfigTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>
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
                        if (!e.data) throw new WorldPatchError(`No data received for world ${world}.`);
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
    
        for (const [key, value] of Object.entries(worldConfig)) {
            // A propriedade `id` existe no banco de dados, mas não na store.
            if (!isKeyOf(key, worldConfigStore)) continue;
            
            // A confirmação dos tipos é feita na store.
            Reflect.set(worldConfigStore, key, value);
        };

    } catch (err) {
        WorldPatchError.catch(err);
    };
};