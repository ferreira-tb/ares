import { isObject } from '@tb-dev/ts-guard';
import { getPanelWindow } from '$electron/utils/helpers.js';
import { MainProcessError } from '$electron/error.js';
import type { PlunderedAmount, PlunderHistoryType } from '$types/plunder.js';
import type { UserAlias } from '$types/electron.js';
import type { PlunderConfig as PlunderConfigTable, PlunderHistory as PlunderHistoryTable } from '$tables/plunder.js';
import type { PlunderConfigProxy, PlunderHistoryProxy } from '$stores/plunder.js';

/**
 * Define o estado das stores de acordo com o alias atual.
 * 
 * Essa função deve ser chamada sempre que o alias for alterado.
 * A responsabilidade de chamar essa função é do Proxy `cacheProxy`.
 * 
 * Entende-se como "alias" o padrão `/^[a-z]+\d+__USERID__{ nome do jogador }/`.
 */
export function setAliasProxyState(
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    plunderConfigProxy: PlunderConfigProxy,
    plunderHistoryProxy: PlunderHistoryProxy
) {
    const args = [PlunderConfig, PlunderHistory, plunderConfigProxy, plunderHistoryProxy] as const;
    return async function (alias: UserAlias) {
        try {       
            await Promise.all([setAllPlunderProxiesState(alias, ...args)]);
        } catch (err) {
            MainProcessError.catch(err);
        };
    };
};

async function setAllPlunderProxiesState(
    alias: UserAlias,
    PlunderConfig: typeof PlunderConfigTable,
    PlunderHistory: typeof PlunderHistoryTable,
    plunderConfigProxy: PlunderConfigProxy,
    plunderHistoryProxy: PlunderHistoryProxy
) {
    const panelWindow = getPanelWindow();

    // Configurações do assistente de saque.
    const plunderConfig = (await PlunderConfig.findByPk(alias))?.toJSON();
    if (isObject(plunderConfig)) {
        for (const [key, value] of Object.entries(plunderConfig)) {
            if (key in plunderConfigProxy) {
                // A confirmação dos tipos é feita no Proxy.
                Reflect.set(plunderConfigProxy, key, value);
            };
        };

        // Atualiza o painel com as configurações para o alias atual.
        panelWindow.webContents.send('patch-panel-plunder-config', plunderConfig);
    };

    // Histórico do assistente de saque.
    const plunderHistory = (await PlunderHistory.findByPk(alias))?.toJSON();
    if (isObject(plunderHistory)) {
        for (const [key, value] of Object.entries(plunderHistory) as [keyof PlunderHistoryType, PlunderedAmount][]) {
            if (!isObject(value)) continue;

            for (const [innerKey, innerValue] of Object.entries(value) as [keyof PlunderedAmount, number][]) {
                if (innerKey in plunderHistoryProxy[key]) {
                    // A confirmação dos tipos é feita no Proxy.
                    Reflect.set(plunderHistoryProxy[key], innerKey, innerValue);
                };
            };
        };

        // Se o Plunder estiver ativo para o alias atual, atualiza o painel com o histórico de recursos.
        // Isso permite que ele continue de onde parou.
        if (isObject(plunderConfig) && plunderConfig.active === true) {
            panelWindow.webContents.send('patch-panel-plunder-history', plunderHistory);
        };
    };
};