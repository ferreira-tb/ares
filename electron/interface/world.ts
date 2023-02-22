import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { isObject, isKeyOf, assertObject } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { createPhobos, destroyPhobos } from '$electron/app/phobos.js';
import { worldConfigURL, worldUnitURL } from '$electron/utils/constants';
import { sequelize } from '$database/database.js';
import type { WorldConfigType, WorldUnitType, UnitDetails } from '$types/world.js';
import type { PhobosPortMessage } from '$types/phobos.js';
import type { World } from '$types/game.js';
import type { WorldConfig as WorldConfigTable, WorldUnit as WorldUnitTable } from '$tables/world.js';
import type { WorldConfigProxy, WorldUnitProxy } from '$stores/world.js';

/**
 * Define o estado das stores de acordo com o mundo atual.
 * 
 * Essa função deve ser chamada sempre que o mundo for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheProxy`.
 * 
 * Ao contrário da função `setProxyState`, essa função não é chamada quando o jogador muda.
 */
export function setWorldProxyState(
    WorldConfig: typeof WorldConfigTable,
    WorldUnit: typeof WorldUnitTable,
    worldConfigProxy: WorldConfigProxy,
    worldUnitProxy: WorldUnitProxy
) {
    return async function(world: World) {
        try {
            await Promise.all([
                setWorldConfigState(world, WorldConfig, worldConfigProxy),
                setWorldUnitState(world, WorldUnit, worldUnitProxy)
            ]);
            
        } catch (err) {
            MainProcessError.catch(err);
        };
    };
};

async function setWorldConfigState(world: World, WorldConfig: typeof WorldConfigTable, worldConfigProxy: WorldConfigProxy) {
    try {
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
                return await WorldConfig.create({
                    id: world,
                    ...state
                }, { transaction });
            });
        };
    
        for (const [key, value] of Object.entries(worldConfig)) {
            // A propriedade `id` existe no banco de dados, mas não no Proxy.
            if (!isKeyOf(key, worldConfigProxy)) continue;
            
            // A confirmação dos tipos é feita no Proxy.
            Reflect.set(worldConfigProxy, key, value);
        };

    } catch (err) {
        MainProcessError.catch(err);
    };
};

async function setWorldUnitState(world: World, WorldUnit: typeof WorldUnitTable, worldUnitProxy: WorldUnitProxy) {
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
                return await WorldUnit.create({
                    id: world,
                    ...state
                }, { transaction });
            });
        };
    
        for (const [key, value] of Object.entries(worldUnit) as [keyof WorldUnitType, UnitDetails | null][]) {
            // Em mundos sem arqueiros, as propriedades `archer` e `marcher` são `null`.
            if (!isObject(value)) continue;
            // A propriedade `id` existe no banco de dados, mas não no Proxy.
            if (!isKeyOf(key, worldUnitProxy)) continue;
    
            for (const [innerKey, innerValue] of Object.entries(value) as [keyof UnitDetails, number][]) {
                // A confirmação dos tipos é feita no Proxy.
                Reflect.set(worldUnitProxy[key], innerKey, innerValue);
            };
        };

    } catch (err) {
        MainProcessError.catch(err);
    };
};