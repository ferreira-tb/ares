import { ipcMain } from 'electron';
import { assertObject, assertPositiveInteger } from '@tb-dev/ts-guard';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import { plunderConfigStore, plunderHistoryStore, getUserAlias } from '$electron/stores/index.js';
import { sequelize } from '$electron/database/database.js';
import { MainProcessError } from '$electron/error.js';
import { getPlunderHistoryAsJSON, PlunderHistory, PlunderConfig } from '$tables/index.js';
import type { PlunderedAmount } from '$types/plunder.js';


export function setPlunderEvents() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    ipcMain.handle('is-plunder-active', () => plunderConfigStore.active);
    ipcMain.handle('get-plunder-config', () => ({ ...plunderConfigStore }));

    type ConfigKeys = keyof typeof plunderConfigStore;
    type ConfigValues = Exclude<typeof plunderConfigStore[ConfigKeys], Function>;
    ipcMain.on('update-plunder-config', async (_e, key: ConfigKeys, value: ConfigValues) => {
        try {
            // A confirmação dos tipos é feita no Proxy.
            (plunderConfigStore as any)[key] = value;
            mainWindow.webContents.send('plunder-config-updated', key, value);
            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({
                    id: await getUserAlias(),
                    ...plunderConfigStore
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.capture(err);
        };
    });

    // Emitido pelo browser após cada ataque realizado pelo Plunder.
    // Atualiza a quantidade de recursos saqueados no painel.
    ipcMain.on('update-plundered-amount', (_e, resources: PlunderedAmount) => {
        try {
            assertObject(resources, 'A quantidade de recursos é inválida.');
            panelWindow.webContents.send('update-plundered-amount', resources);
        } catch (err) {
            MainProcessError.capture(err);
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
    
            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: await getUserAlias(),
                    last: { ...plunderHistoryStore.last },
                    total: { ...plunderHistoryStore.total }
                }, { transaction });
            });
            
        } catch (err) {
            MainProcessError.capture(err);
        };
    });

    // Obtém a quantidade de recursos saqueados durante a última execução do Plunder.
    ipcMain.handle('get-last-plundered-amount', async () => {
        try {
            const history = await getPlunderHistoryAsJSON();
            assertObject(history, 'Não foi possível obter a quantidade de recursos saqueados.');
            return history.last;
        } catch (err) {
            MainProcessError.capture(err);
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
            MainProcessError.capture(err);
            return null;
        };
    });
};