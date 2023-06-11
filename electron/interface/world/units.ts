import { WorldInterfaceError } from '$electron/error';
import { TribalWorker } from '$electron/worker';
import { getWorldUnitInfoUrl } from '$common/helpers';
import { TribalWorkerName } from '$common/constants';
import { sequelize } from '$electron/database';
import type { WorldUnits as WorldUnitsTable } from '$electron/database/models/world';
import type { createWorldUnitStoresMap } from '$electron/stores/world';
import type { defineCacheStore } from '$electron/stores/cache';

export async function patchWorldUnits(
    world: World,
    WorldUnits: typeof WorldUnitsTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>
) {
    try {
        const cacheStore = useCacheStore();

        let worldUnit = (await WorldUnits.findByPk(world))?.toJSON();
        if (!worldUnit) {
            // Se não houver informações sobre as unidades do mundo atual, cria um novo registro.
            const state = await new Promise<WorldUnitsType>(async (resolve, reject) => {
                const url = getWorldUnitInfoUrl(world, cacheStore.region);
                const worker = new TribalWorker(TribalWorkerName.FetchWorldUnits, url);
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
            worldUnit = await sequelize.transaction(async () => {
                return (await WorldUnits.create({ id: world, ...state })).toJSON();
            });
        };

        for (const [key, value] of Object.entries(worldUnit) as [keyof WorldUnitsType, UnitDetails | null][]) {
            // Em mundos sem arqueiros, as propriedades `archer` e `marcher` são `null`.
            if (!value) continue;
            // A propriedade `id` existe no banco de dados, mas não na store.
            if (!worldUnitsMap.has(key)) continue;
    
            const useUnit = worldUnitsMap.getStrict(key);
            const unitStore = useUnit();

            for (const [unit, amount] of Object.entries(value) as [keyof UnitDetails, number][]) {
                if (unit in unitStore) {
                    unitStore[unit] = amount;
                };
            };
        };

    } catch (err) {
        WorldInterfaceError.catch(err);
    };
};