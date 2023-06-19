import { watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { WorldConfig } from '$electron/database/models';
import { appConfig } from '$electron/stores';
import { TribalWorker } from '$electron/worker';
import { TribalWorkerName } from '$common/enum';
import { isWorld } from '$common/guards';
import { getWorldConfigUrl } from '$common/utils';
import { MainProcessError } from '$electron/error';

export function setWorldConfigEvents(world: MechanusRef<World | null>) {
    watch(world, async (newWorld) => {
        if (!isWorld(newWorld)) return;
        try {
            const previous = await WorldConfig.findByPk(newWorld);
            if (!previous) {
                // Se não houver configurações para o mundo atual, cria um novo registro.
                const region = appConfig.get('general').lastRegion;
                const url = getWorldConfigUrl(newWorld, region);

                const worker = new TribalWorker(TribalWorkerName.FetchWorldConfig, url);
                const config = await new Promise<WorldConfigType>((resolve, reject) => {
                    worker.once('destroyed', reject);
                    worker.once('port:message', (message: WorldConfigType | null) => {
                        try {
                            if (!message) {
                                throw new MainProcessError(`Could not fetch world config for ${world}.`);
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
                    await WorldConfig.create({ id: newWorld, ...config });
                });
            };
    
        } catch (err) {
            MainProcessError.catch(err);
        };
    });
};