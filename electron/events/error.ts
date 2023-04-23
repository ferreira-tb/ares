import { URL } from 'url';
import { Op } from 'sequelize';
import { app, ipcMain, BrowserWindow } from 'electron';
import { MainProcessEventError } from '$electron/error';
import { sequelize } from '$electron/database';
import { getActiveModule } from '$electron/app/modules';
import { ErrorLog, ElectronErrorLog, useAresStore } from '$electron/interface';
import type { ErrorLogBase, ErrorLogType } from '$types/error';

export function setErrorEvents() {
    const aresStore = useAresStore();

    ipcMain.on('error:create-log', async (e, error: ErrorLogBase) => {
        try {
            const errorLog: Omit<ErrorLogType, 'id' | 'pending'> = {
                name: error.name,
                message: error.message,
                stack: error.stack,
                world: aresStore.world,
                time: Date.now(),
                url: new URL(e.sender.getURL()).href,
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresStore.majorVersion,
                locale: aresStore.locale
            };

            const newRow = await sequelize.transaction(async (transaction) => {
                const row = await ErrorLog.create(errorLog, { transaction });
                return row;
            });

            const errorModule = getActiveModule('error-log');
            if (errorModule instanceof BrowserWindow) {
                errorModule.webContents.send('error:log-did-update', newRow.toJSON());
            };

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('error:get-log', async () => {
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

    ipcMain.on('error:delete-log', async (_e, id: number) => {
        try {
            await sequelize.transaction(async (transaction) => {
                await ErrorLog.destroy({ where: { id }, transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('error:get-electron-log', async () => {
        try {
            await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await ElectronErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
            });
            
            const errors = await ElectronErrorLog.findAll();
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.on('error:delete-electron-log', async (_e, id: number) => {
        try {
            await sequelize.transaction(async (transaction) => {
                await ElectronErrorLog.destroy({ where: { id }, transaction });
            });
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};