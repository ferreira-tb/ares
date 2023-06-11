import { storeToRefs, watch } from 'mechanus';
import { sequelize } from '$electron/database';
import { WorldUnits } from '$electron/database/models';
import { useCacheStore } from '$electron/interface';
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
            const worldUnit = await WorldUnits.findByPk(world);
            if (!worldUnit) {
                // Se não houver informações sobre as unidades do mundo atual, cria um novo registro.
                const newInfo = await new Promise<WorldUnitsType>(async (resolve, reject) => {
                    const url = getWorldUnitInfoUrl(world, region.value);
                    const worker = new TribalWorker(TribalWorkerName.FetchWorldUnits, url);
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
                    await WorldUnits.create({ id: world, ...newInfo });
                });
            };
    
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    };
};