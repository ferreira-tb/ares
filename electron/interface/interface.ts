import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { isObject, isKeyOf, assertObject } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { assertPanelWindow } from '$electron/utils/helpers.js';
import { createPhobos, destroyPhobos } from '$electron/app/phobos.js';
import { worldConfigURL, worldUnitURL } from '$electron/utils/constants';
import { sequelize } from '$database/database.js';

import { UserConfig } from '$tables/config.js';
import { ErrorLog, DOMErrorLog } from '$tables/error.js';
import { PlunderHistory, PlunderConfig } from '$tables/plunder.js';
import { User } from '$tables/user.js';
import { WorldConfig, WorldUnit } from '$tables/world.js';

import { setPlunderStore, setPlunderConfigStore, setPlunderHistoryStore } from '$stores/plunder.js';
import { setBrowserStore } from '$stores/browser.js';
import { setCacheStore } from '$stores/cache.js';
import { setUnitStore } from '$stores/units.js';
import { setWorldConfigStore, setWorldUnitStore } from '$stores/world.js';

import type { BrowserWindow } from 'electron';
import type { PlunderedAmount, PlunderHistoryType } from '$types/plunder.js';
import type { WorldConfigType, WorldUnitType, UnitDetails } from '$types/world.js';
import type { UserAlias } from '$types/electron.js';
import type { PhobosPortMessage } from '$types/phobos.js';
import type { World } from '$types/game.js';

export const cacheStore = setCacheStore(setAliasStoreState, setWorldStoreState);
export const browserStore = setBrowserStore(cacheStore, User);
export const plunderStore = setPlunderStore();
export const plunderConfigStore = setPlunderConfigStore();
export const plunderHistoryStore = setPlunderHistoryStore();
export const unitStore = setUnitStore();
export const worldConfigStore = setWorldConfigStore();
export const worldUnitStore = setWorldUnitStore();

/**
 * Define o estado das stores de acordo com o alias atual.
 * 
 * Essa função deve ser chamada sempre que o alias for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheStore`.
 * 
 * Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.
 */
async function setAliasStoreState(alias: UserAlias) {
    try {
        const panelWindow = assertPanelWindow();
        await Promise.all([setAllPlunderStoresState(alias, panelWindow)]);

    } catch (err) {
        MainProcessError.catch(err);
    };
};

/**
 * Define o estado das stores de acordo com o mundo atual.
 * 
 * Essa função deve ser chamada sempre que o mundo for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheStore`.
 * 
 * Ao contrário da função `setStoreState`, essa função não é chamada quando o jogador muda.
 */
async function setWorldStoreState(world: World) {
    try {
        await Promise.all([
            setWorldConfigState(world),
            setWorldUnitState(world)
        ]);

    } catch (err) {
        MainProcessError.catch(err);
    };
};

async function setAllPlunderStoresState(alias: UserAlias, panelWindow: BrowserWindow) {
    // Configurações do assistente de saque.
    const plunderConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
    if (isObject(plunderConfig)) {
        for (const [key, value] of Object.entries(plunderConfig)) {
            if (key in plunderConfigStore) {
                // A confirmação dos tipos é feita no Proxy.
                Reflect.set(plunderConfigStore, key, value);
            };
        };

        // Atualiza o painel com as configurações para o alias atual.
        panelWindow.webContents.send('update-plunder-config', plunderConfig);
    };

    // Histórico do assistente de saque.
    const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
    if (isObject(plunderHistory)) {
        type PlunderHistoryKeys = keyof PlunderHistoryType;
        for (const [key, value] of Object.entries(plunderHistory) as [PlunderHistoryKeys, PlunderedAmount][]) {
            if (!isObject(value)) continue;

            for (const [innerKey, innerValue] of Object.entries(value) as [keyof PlunderedAmount, number][]) {
                if (innerKey in plunderHistoryStore[key]) {
                    // A confirmação dos tipos é feita no Proxy.
                    Reflect.set(plunderHistoryStore[key], innerKey, innerValue);
                };
            };
        };

        // Se o Plunder estiver ativo para o alias atual, atualiza o painel com o histórico de recursos.
        // Isso permite que ele continue de onde parou.
        if (isObject(plunderConfig) && plunderConfig.active === true) {
            panelWindow.webContents.send('update-plunder-history', plunderHistory);
        };
    };
};

async function setWorldConfigState(world: World) {
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
            if (!isKeyOf(key, worldConfigStore)) continue;
            
            // A confirmação dos tipos é feita no Proxy.
            Reflect.set(worldConfigStore, key, value);
        };

    } catch (err) {
        MainProcessError.catch(err);
    };
};

async function setWorldUnitState(world: World) {
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
            if (!isKeyOf(key, worldUnitStore)) continue;
    
            for (const [innerKey, innerValue] of Object.entries(value) as [keyof UnitDetails, number][]) {
                // A confirmação dos tipos é feita no Proxy.
                Reflect.set(worldUnitStore[key], innerKey, innerValue);
            };
        };

    } catch (err) {
        MainProcessError.catch(err);
    };
};

export type {
    setAliasStoreState as SetAliasStoreState,
    setWorldStoreState as SetWorldStoreState
};

export {
    UserConfig,
    ErrorLog,
    DOMErrorLog,
    PlunderHistory,
    PlunderConfig,
    User,
    WorldConfig,
    WorldUnit
};