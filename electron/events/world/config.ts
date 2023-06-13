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
            const worldConfig = await WorldConfig.findByPk(world);
            if (!worldConfig) {
                // Se não houver configurações para o mundo atual, cria um novo registro.
                const newConfig = await new Promise<WorldConfigType>(async (resolve, reject) => {
                    const url = getWorldConfigUrl(world, region.value);
                    const worker = new TribalWorker(TribalWorkerName.FetchWorldConfig, url);
                    await worker.init((e) => {
                        try {
                            if (!e.data) {
                                throw new MainProcessEventError(`No data received for world ${world}.`);
                            };
                            resolve(e.data);
                        } catch (err) {
                            reject(err);
                        } finally {
                            worker.destroy();
                        };
                    });
                });
    
                // Salva o registro no banco de dados.
                await sequelize.transaction(async () => {
                    await WorldConfig.create({ id: world, ...newConfig });
                });
            };
    
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    };
};