import { ipcMain, BrowserWindow, type WebContents } from 'electron';
import { assertObject, assertPositiveInteger, isObject, isKeyOf } from '@tb-dev/ts-guard';
import { getPanelWindow } from '$electron/utils/helpers.js';
import { assertUserAlias, isUserAlias } from '$electron/utils/guards.js';
import { sequelize } from '$database/database.js';
import { MainProcessError } from '$electron/error.js';
import { showAppConfig } from '$electron/app/modules.js';
import { PlunderHistory, PlunderConfig, plunderConfigProxy, plunderHistoryProxy, cacheProxy } from '$interface/index.js';
import type { PlunderedAmount, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

export function setPlunderEvents() {
    const panelWindow = getPanelWindow();

    // Abre a janela de configurações avançadas do Plunder.
    ipcMain.on('open-plunder-config-window', () => showAppConfig('plunder-config'));
    // Verifica se o Plunder está ativo.
    ipcMain.handle('is-plunder-active', () => plunderConfigProxy.active);
    // Obtém as configurações do Plunder.
    ipcMain.handle('get-plunder-config', () => {
        const alias = cacheProxy.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigProxy };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('update-plunder-config', async (e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            if (!isKeyOf(key, plunderConfigProxy)) return;

            const previousValue = Reflect.get(plunderConfigProxy, key);
            if (previousValue === value) return;

            // A confirmação dos tipos é feita no Proxy.
            Reflect.set(plunderConfigProxy, key, value);

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const browserWindow of BrowserWindow.getAllWindows()) {
                if (browserWindow.webContents !== (e.sender satisfies WebContents)) {
                    browserWindow.webContents.send('plunder-config-updated', key, value);
                };
            };

            const userAlias = cacheProxy.userAlias;
            assertUserAlias(userAlias);

            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({
                    id: userAlias,
                    ...plunderConfigProxy
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    // Emitido pelo browser após cada ataque realizado pelo Plunder.
    // Atualiza a quantidade de recursos saqueados no painel.
    ipcMain.on('update-plundered-amount', (_e, resources: PlunderedAmount) => {
        try {
            assertObject(resources, 'A quantidade de recursos é inválida.');
            panelWindow.webContents.send('patch-panel-plundered-amount', resources);
        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    // Emitido pelo browser quando o Plunder é desativado.
    // Salva a quantidade de recursos saqueados durante a última execução do Plunder.
    ipcMain.on('save-plundered-amount', async (_e, resources: PlunderedAmount) => {
        try {
            assertObject(resources, 'A quantidade de recursos é inválida.');

            for (const [key, value] of Object.entries(resources) as [keyof PlunderedAmount, number][]) {
                assertPositiveInteger(value, 'A quantidade de recursos é inválida.');
                plunderHistoryProxy.last[key] = value;
                plunderHistoryProxy.total[key] += value;
            };

            const userAlias = cacheProxy.userAlias;
            assertUserAlias(userAlias);

            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    last: { ...plunderHistoryProxy.last },
                    total: { ...plunderHistoryProxy.total }
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    // Obtém a quantidade de recursos saqueados durante a última execução do Plunder.
    ipcMain.handle('get-last-plundered-amount', async () => {
        try {
            const history = await getPlunderHistoryAsJSON();
            assertObject(history, 'Não foi possível obter a quantidade de recursos saqueados.');
            return history.last;
        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });

    // Obtém a quantidade total de recursos saqueados em determinado mundo.
    ipcMain.handle('get-total-plundered-amount', async () => {
        try {
            const history = await getPlunderHistoryAsJSON();
            assertObject(history, 'Não foi possível obter a quantidade total de recursos saqueados.');
            return history.total;
        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });
};

async function getPlunderHistoryAsJSON(): Promise<PlunderHistory | null> {
    try {
        const result = await sequelize.transaction(async (transaction) => {
            const userAlias = cacheProxy.userAlias;
            if (!isUserAlias(userAlias)) return null;

            const plunderHistory = await PlunderHistory.findByPk(userAlias, { transaction });
            if (!isObject(plunderHistory)) return null;

            return plunderHistory.toJSON();
        });

        return result as PlunderHistory | null;

    } catch (err) {
        MainProcessError.catch(err);
        return null;
    };
};