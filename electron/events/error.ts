import { URL } from 'url';
import { Op } from 'sequelize';
import { app, ipcMain, BrowserWindow } from 'electron';
import { assertInteger, assertString } from '@tb-dev/ts-guard';
import { MainProcessEventError } from '$electron/error';
import { sequelize } from '$database/database';
import { getActiveModule } from '$electron/app/modules';
import { ErrorLog, DOMErrorLog, MainProcessErrorLog, useAresStore } from '$interface/index';
import type { ErrorLogBase, ErrorLogType, DOMErrorLogBase, DOMErrorLogType } from '$types/error';

export function setErrorEvents() {
    const aresStore = useAresStore();

    ipcMain.on('set-error-log', async (_e, err: ErrorLogBase) => {
        try {
            assertString(err.name, 'Error name is invalid.');
            assertString(err.message, 'The error message is invalid.');

            const errorLog: Omit<ErrorLogType, 'id' | 'pending'> = {
                name: err.name,
                message: err.message,
                stack: err.stack,
                world: aresStore.world,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresStore.majorVersion,
                locale: aresStore.locale
            };

            const newRow = await sequelize.transaction(async (transaction) => {
                return await ErrorLog.create(errorLog, { transaction });
            });

            const errorModule = getActiveModule('error-log');
            if (errorModule instanceof BrowserWindow) {
                errorModule.webContents.send('error-log-did-update', newRow.toJSON());
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-error-log', async () => {
        try {
            await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await ErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
            });
            
            const errors = await ErrorLog.findAll();
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('delete-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'Error ID is invalid.');
            await sequelize.transaction(async (transaction) => {
                await ErrorLog.destroy({ where: { id }, transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('set-dom-error-log', async (e, err: DOMErrorLogBase) => {
        try {
            assertString(err.selector, `Invalid CSS selector: ${err.selector}`);

            const domErrorLog: Omit<DOMErrorLogType, 'id' | 'pending'> = {
                name: err.name,
                url: new URL(e.sender.getURL()).href,
                world: aresStore.world,
                selector: err.selector,
                stack: err.stack,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresStore.majorVersion,
                locale: aresStore.locale
            };

            const newRow = await sequelize.transaction(async (transaction) => {
                return await DOMErrorLog.create(domErrorLog, { transaction });
            });

            const errorModule = getActiveModule('error-log');
            if (errorModule instanceof BrowserWindow) {
                errorModule.webContents.send('dom-error-log-did-update', newRow.toJSON());
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        }; 
    });

    ipcMain.handle('get-dom-error-log', async () => {
        try {
            await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await DOMErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
            });

            const errors = await DOMErrorLog.findAll();
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('delete-dom-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'Error ID is invalid.');
            await sequelize.transaction(async (transaction) => {
                await DOMErrorLog.destroy({ where: { id }, transaction });
            });
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-electron-error-log', async () => {
        try {
            await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await MainProcessErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
            });
            
            const errors = await MainProcessErrorLog.findAll();
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('delete-electron-error-log', async (_e, id: number) => {
        try {
            assertInteger(id, 'Error ID is invalid.');
            await sequelize.transaction(async (transaction) => {
                await MainProcessErrorLog.destroy({ where: { id }, transaction });
            });
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};