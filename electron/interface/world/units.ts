import { MessageChannelMain } from 'electron';
import { WorldInterfaceError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { getWorldUnitInfoUrl } from '$global/helpers';
import { sequelize } from '$electron/database';
import type { WorldUnitsType, UnitDetails } from '$types/world';
import type { PhobosPortMessage } from '$types/phobos';
import type { World } from '$types/game';
import type { WorldUnits as WorldUnitsTable } from '$electron/database/world';
import type { createWorldUnitStoresMap } from '$stores/world';
import type { defineCacheStore } from '$stores/cache';

export async function patchWorldUnitsStoresState(
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
                const phobos = await createPhobos('fetch-world-unit', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'fetch-world-unit' } satisfies PhobosPortMessage);
    
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
            worldUnit = await sequelize.transaction(async (transaction) => {
                return (await WorldUnits.create({ id: world, ...state }, { transaction })).toJSON();
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