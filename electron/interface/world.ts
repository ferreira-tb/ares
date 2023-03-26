import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { isObject, isKeyOf, assertObject } from '@tb-dev/ts-guard';
import { WorldPatchError } from '$electron/error';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { worldConfigURL, worldUnitURL } from '$electron/utils/constants';
import { isWorld } from '$electron/utils/guards';
import { sequelize } from '$database/database';
import type { WorldConfigType, WorldUnitType, UnitDetails } from '$types/world';
import type { PhobosPortMessage } from '$types/phobos';
import type { World } from '$types/game';
import type { WorldConfig as WorldConfigTable, WorldUnit as WorldUnitTable } from '$tables/world';
import type { defineWorldConfigStore, createWorldUnitStoresMap } from '$stores/world';

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
    WorldUnit: typeof WorldUnitTable,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>
) {
    return async function(world: World | null) {
        try {
            if (!isWorld(world)) return;
            await Promise.all([
                patchWorldConfigStoreState(world, WorldConfig, useWorldConfigStore),
                patchWorldUnitStoresState(world, WorldUnit, worldUnitsMap)
            ]);
            
        } catch (err) {
            WorldPatchError.catch(err);
        };
    };
};

async function patchWorldConfigStoreState(
    world: World,
    WorldConfig: typeof WorldConfigTable,
    useWorldConfigStore: ReturnType<typeof defineWorldConfigStore>
) {
    try {
        const worldConfigStore = useWorldConfigStore();

        let worldConfig = (await WorldConfig.findByPk(world))?.toJSON();
        if (!isObject(worldConfig)) {
            // Se não houver configurações para o mundo atual, cria um novo registro.
            const state = await new Promise<WorldConfigType>(async (resolve, reject) => {
                const url = new URL(worldConfigURL(world));
                const phobos = await createPhobos('fetch-world-config', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'fetch-world-config' } satisfies PhobosPortMessage);
    
                port1.on('message', (e) => {
                    try {
                        assertObject<WorldConfigType>(e.data);
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
    WorldUnit: typeof WorldUnitTable,
    worldUnitsMap: ReturnType<typeof createWorldUnitStoresMap>
) {
    try {
        let worldUnit = (await WorldUnit.findByPk(world))?.toJSON();
        if (!isObject(worldUnit)) {
            // Se não houver informações sobre as unidades do mundo atual, cria um novo registro.
            const state = await new Promise<WorldUnitType>(async (resolve, reject) => {
                const url = new URL(worldUnitURL(world));
                const phobos = await createPhobos('fetch-world-unit', url, { override: true });
                
                const { port1, port2 } = new MessageChannelMain();
                phobos.webContents.postMessage('port', null, [port2]);
                port1.postMessage({ channel: 'fetch-world-unit' } satisfies PhobosPortMessage);
    
                port1.on('message', (e) => {
                    try {
                        assertObject<WorldUnitType>(e.data);
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
                return (await WorldUnit.create({ id: world, ...state }, { transaction })).toJSON();
            });
        };

        for (const [key, value] of Object.entries(worldUnit) as [keyof WorldUnitType, UnitDetails | null][]) {
            // Em mundos sem arqueiros, as propriedades `archer` e `marcher` são `null`.
            if (!isObject(value)) continue;
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