import { watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { WorldUnits } from '$electron/database/models';
import { appConfig } from '$electron/stores';
import { TribalWorker } from '$electron/worker';
import { TribalWorkerName } from '$common/enum';
import { isWorld } from '$common/guards';
import { getWorldUnitInfoUrl } from '$common/utils';
import { MainProcessError } from '$electron/error';

export function setWorldUnitsEvents(world: MechanusRef<World | null>) {
    watch(world, async (newWorld) => {
        if (!isWorld(newWorld)) return;
        try {
            const previous = await WorldUnits.findByPk(newWorld);
            if (!previous) {
                // Se não houver informações sobre as unidades do mundo atual, cria um novo registro.
                const region = appConfig.get('general').lastRegion;
                const url = getWorldUnitInfoUrl(newWorld, region);

                const worker = new TribalWorker(TribalWorkerName.FetchWorldUnits, url);
                const info = await new Promise<WorldUnitsType>((resolve, reject) => {
                    worker.once('destroyed', reject);
                    worker.once('port:message', (message: WorldUnitsType | null) => {
                        try {
                            if (!message) {
                                throw new MainProcessError(`Could not fetch world units for ${newWorld}.`);
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
                    await WorldUnits.create({ id: newWorld, ...info });
                });
            };
    
        } catch (err) {
            MainProcessError.catch(err);
        };
    });
};