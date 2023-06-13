import { storeToRefs, watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { WorldUnits } from '$electron/database/models';
import { useCacheStore } from '$electron/stores';
import { TribalWorker } from '$electron/worker';
import { TribalWorkerName } from '$common/constants';
import { isWorld } from '$common/guards';
import { getWorldUnitInfoUrl } from '$common/helpers';
import { MainProcessEventError } from '$electron/error';

export function setWorldUnitsEvents(world: MechanusRef<World | null>) {
    watch(world, fetchWorldUnits());
};

function fetchWorldUnits() {
    const cacheStore = useCacheStore();
    const { region } = storeToRefs(cacheStore);

    return async function(world: World | null) {
        if (!isWorld(world)) return;
        try {
            const previous = await WorldUnits.findByPk(world);
            if (!previous) {
                // Se não houver informações sobre as unidades do mundo atual, cria um novo registro.
                const url = getWorldUnitInfoUrl(world, region.value);
                const worker = new TribalWorker(TribalWorkerName.FetchWorldUnits, url);
                const info = await new Promise<WorldUnitsType>((resolve, reject) => {
                    worker.once('destroyed', reject);
                    worker.once('port:message', (message: WorldUnitsType | null) => {
                        try {
                            if (!message) {
                                throw new MainProcessEventError(`Could not fetch world units for ${world}.`);
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
                    await WorldUnits.create({ id: world, ...info });
                });
            };
    
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    };
};