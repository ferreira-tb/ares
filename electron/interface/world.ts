import { MessageChannelMain } from 'electron';
import { isKeyOf } from '$global/guards';
import { WorldPatchError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { getWorldConfigUrl, getWorldUnitUrl } from '$global/helpers';
import { isWorld } from '$global/guards';
import { sequelize } from '$electron/database';
import type { WorldConfigType, WorldUnitsType, UnitDetails } from '$types/world';
import type { PhobosPortMessage } from '$types/phobos';
import type { World } from '$types/game';
import type { WorldConfig as WorldConfigTable, WorldUnits as WorldUnitsTable } from '$electron/database/world';
import type { defineWorldConfigStore, createWorldUnitStoresMap } from '$stores/world';
import type { defineCacheStore } from '$stores/cache';

/**
 * Define o estado das stores de acordo com o mundo atual.
 * 
 * Essa função deve ser chamada sempre que o mundo for alterado.
 * A responsabilidade de chamar essa função é do watch no index da interface.
 * 
 * Ao contrário da função `setProxyState`, essa função não é chamada quando o jogador muda.
 */
export function patchWorldRelatedStores(
    WorldConfig: typeof WorldConfigTable,
    WorldUnits: typeof WorldUnitsTable,
    useCacheStore: ReturnType<typeof defineCacheStore>,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>
) {
    return async function(world: World | null) {
        try {
            if (!isWorld(world)) return;
            await Promise.all([
                patchWorldConfigStoreState(world, WorldConfig, useCacheStore, useWorldConfigStore),
                patchWorldUnitStoresState(world, WorldUnits, useCacheStore, worldUnitsMap)
            ]);   

        } catch (err) {
            WorldPatchError.catch(err);
        };
    };
};

async function patchWorldConfigStoreState(
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
                        if (!e.data) throw new WorldPatchError('No data received');
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

async function patchWorldUnitStoresState(
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
                const url = getWorldUnitUrl(world, cacheStore.region);
                const phobos = await createPhobos('fetch-world-unit', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'fetch-world-unit' } satisfies PhobosPortMessage);
    
                port1.on('message', (e) => {
                    try {
                        if (!e.data) throw new WorldPatchError('No data received');
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

            for (const [innerKey, innerValue] of Object.entries(value) as [keyof UnitDetails, number][]) {
                // A confirmação dos tipos é feita na store.
                Reflect.set(unitStore, innerKey, innerValue);
            };
        };

    } catch (err) {
        WorldPatchError.catch(err);
    };
};