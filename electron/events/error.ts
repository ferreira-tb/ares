import { app, ipcMain, BrowserWindow } from 'electron';
import { URL } from 'url';
import { Op } from 'sequelize';
import { assertInteger, assertString, isInstanceOf } from '@tb-dev/ts-guard';
import { MainProcessEventError } from '$electron/error.js';
import { sequelize } from '$database/database.js';
import { ErrorLog, DOMErrorLog, MainProcessErrorLog, aresProxy } from '$interface/index.js';
import { getActiveModule } from '$electron/app/modules.js';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType } from '$types/error.js';

export function setErrorEvents() {
    ipcMain.on('set-error-log', async (_e, err: ErrorLogBase) => {
        try {
            assertString(err.name, 'O nome do erro é inválido.');
            assertString(err.message, 'Não há uma mensagem válida no relatório de erro.');

            const errorLog: Omit<ErrorLogType, 'id' | 'pending'> = {
                name: err.name,
                message: err.message,
                stack: err.stack,
                world: aresProxy.world,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresProxy.majorVersion,
                locale: aresProxy.locale
            };

            await sequelize.transaction(async (transaction) => {
                const newRow = await ErrorLog.create(errorLog, { transaction });
                const errorModule = getActiveModule('error-log');
                if (isInstanceOf(errorModule, BrowserWindow)) {
                    errorModule.webContents.send('error-log-updated', newRow.toJSON());
                };
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('delete-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'O ID do registro de erro é inválido.');
            await sequelize.transaction(async (transaction) => {
                await ErrorLog.destroy({ where: { id }, transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-error-log', async () => {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await ErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
                return await ErrorLog.findAll({ raw: true, transaction });
            });
            
            return result;

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('set-dom-error-log', async (e, err: DOMErrorLogBase) => {
        try {
            assertString(err.selector, 'O seletor informado no relatório de erro é inválido.');

            const domErrorLog: Omit<DOMErrorLogType, 'id' | 'pending'> = {
                name: err.name,
                url: new URL(e.sender.getURL()).href,
                world: aresProxy.world,
                selector: err.selector,
                stack: err.stack,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresProxy.majorVersion,
                locale: aresProxy.locale
            };

            await sequelize.transaction(async (transaction) => {
                const newRow = await DOMErrorLog.create(domErrorLog, { transaction });
                const errorModule = getActiveModule('error-log');
                if (isInstanceOf(errorModule, BrowserWindow)) {
                    errorModule.webContents.send('dom-error-log-updated', newRow.toJSON());
                };
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        }; 
    });

    ipcMain.on('delete-dom-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'O ID do registro de erro é inválido.');
            await sequelize.transaction(async (transaction) => {
                await DOMErrorLog.destroy({ where: { id }, transaction });
            });
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-dom-error-log', async () => {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await DOMErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
                return await DOMErrorLog.findAll({ raw: true, transaction });
            });
            
            return result;

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('delete-main-process-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'O ID do registro de erro é inválido.');
            await sequelize.transaction(async (transaction) => {
                await MainProcessErrorLog.destroy({ where: { id }, transaction });
            });
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-main-process-error-log', async () => {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await MainProcessErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
                return await MainProcessErrorLog.findAll({ raw: true, transaction });
            });
            
            return result;

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });
};