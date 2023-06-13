import { storeToRefs, watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { WorldConfig } from '$electron/database/models';
import { useCacheStore } from '$electron/stores';
import { TribalWorker } from '$electron/worker';
import { TribalWorkerName } from '$common/constants';
import { isWorld } from '$common/guards';
import { getWorldConfigUrl } from '$common/helpers';
import { MainProcessEventError } from '$electron/error';

export function setWorldConfigEvents(world: MechanusRef<World | null>) {
    watch(world, fetchWorldConfig());
};

function fetchWorldConfig() {
    const cacheStore = useCacheStore();
    const { region } = storeToRefs(cacheStore);

    return async function(world: World | null) {
        if (!isWorld(world)) return;
        try {
            const previous = await WorldConfig.findByPk(world);
            if (!previous) {
                // Se não houver configurações para o mundo atual, cria um novo registro.
                const url = getWorldConfigUrl(world, region.value);
                const worker = new TribalWorker(TribalWorkerName.FetchWorldConfig, url);
                const config = await new Promise<WorldConfigType>((resolve, reject) => {
                    worker.once('destroyed', reject);
                    worker.once('port:message', (message: WorldConfigType | null) => {
                        try {
                            if (!message) {
                                throw new MainProcessEventError(`Could not fetch world config for ${world}.`);
                            };
                            resolve(message);
                        } catch (err) {
                            reject(err);
                        } finally {
                            worker.destroy();
                        };
                    });

                    worker.init().catch(reject);
                });
                
                // Salva o registro no banco de dados.
                await sequelize.transaction(async () => {
                    await WorldConfig.create({ id: world, ...config });
                });
            };
    
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    };
};