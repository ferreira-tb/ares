import { ipcMain } from 'electron';
import { assertObject, assertPositiveInteger, isObject, isKeyOf } from '@tb-dev/ts-guard';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import { assertUserAlias } from '$electron/utils/guards.js';
import { sequelize } from '$database/database.js';
import { MainProcessError } from '$electron/error.js';
import { isUserAlias } from '$electron/utils/guards.js';
import type { PlunderConfigType, PlunderedAmount } from '$types/plunder.js';

import {
    PlunderHistory,
    PlunderConfig,
    plunderConfigStore,
    plunderHistoryStore,
    cacheStore
} from '$interface/interface.js';

export function setPlunderEvents() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    ipcMain.handle('is-plunder-active', () => plunderConfigStore.active);
    ipcMain.handle('get-plunder-config', () => ({ ...plunderConfigStore }));

    ipcMain.on('update-plunder-config', async (_e, plunderConfig: PlunderConfigType) => {
        try {
            for (const [key, value] of Object.entries(plunderConfig)) {
                if (!isKeyOf(key, plunderConfigStore)) continue;

                const previousValue = Reflect.get(plunderConfigStore, key);
                if (previousValue === value) continue;
                
                // A confirmação dos tipos é feita no Proxy.
                Reflect.set(plunderConfigStore, key, value);
                mainWindow.webContents.send('plunder-config-updated', key, value);
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias);

            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({
                    id: userAlias,
                    ...plunderConfigStore
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
            panelWindow.webContents.send('update-plundered-amount', resources);
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
                plunderHistoryStore.last[key] = value;
                plunderHistoryStore.total[key] += value;
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias);
    
            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    last: { ...plunderHistoryStore.last },
                    total: { ...plunderHistoryStore.total }
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
            const userAlias = cacheStore.userAlias;
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