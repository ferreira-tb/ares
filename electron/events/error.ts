import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { URL } from 'node:url';
import { Op } from 'sequelize';
import { app, dialog, ipcMain } from 'electron';
import { MainProcessError } from '$electron/error';
import { sequelize } from '$electron/database';
import { MainWindow, StandardWindow } from '$electron/windows';
import { useCacheStore, useGameDataStore } from '$electron/stores';
import { ErrorLog, ElectronErrorLog } from '$electron/database/models';
import { StandardWindowName } from '$common/enum';

export function setErrorEvents() {
    const cacheStore = useCacheStore();
    const gameDataStore = useGameDataStore();
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('error:create-log', async (e, error: OmitOptionalErrorLogProps<ErrorLogBase>) => {
        try {
            const errorLog: OmitOptionalErrorLogProps<ErrorLogType> = {
                name: error.name,
                message: error.message,
                stack: error.stack,
                world: cacheStore.world,
                time: Date.now(),
                url: new URL(e.sender.getURL()).href,
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: gameDataStore.majorVersion,
                locale: gameDataStore.locale
            };

            const newRow = await sequelize.transaction(async () => {
                const row = await ErrorLog.create(errorLog);
                return row;
            });

            const errorWindow = StandardWindow.getWindow(StandardWindowName.ErrorLog);
            errorWindow?.webContents.send('error:did-create-log', newRow.toJSON());

        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    ipcMain.handle('error:get-log', async () => {
        try {
            await sequelize.transaction(async () => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                await ErrorLog.destroy({ where: { time: { [Op.lte]: Date.thirtyDaysAgo() } } });
            });
            
            const errors = await ErrorLog.findAll({ where: { pending: true } });
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });

    ipcMain.handle('error:get-electron-log', async () => {
        try {
            await sequelize.transaction(async () => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.thirtyDaysAgo();
                await ElectronErrorLog.destroy({ where: { time: { [Op.lte]: expiration } } });
            });
            
            const errors = await ElectronErrorLog.findAll({ where: { pending: true } });
            return errors.map((error) => error.toJSON());

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });

    ipcMain.handle('error:export', async (): Promise<'canceled' | 'error' | 'sucess'> => {
        try {
            const normalErrors = await ErrorLog.findAll({ where: { pending: true } });
            const electronErrors = await ElectronErrorLog.findAll({ where: { pending: true } });
            const errors = [...normalErrors, ...electronErrors].sort((a, b) => a.time - b.time);
            if (errors.length === 0) return 'canceled';

            const userData = app.getPath('userData');
            const filePath = path.join(userData, 'error.log');

            const asJson = errors.map((err) => err.toJSON()) as AllErrorLogTypes[];
            const content = MainProcessError.generateLogContent(asJson);
            await fs.appendFile(filePath, content, { encoding: 'utf-8' });

            const defaultPath = `ares-${Date.now()}.log`;
            const { canceled, filePath: savePath } = await dialog.showSaveDialog(mainWindow.browser, { defaultPath });

            if (canceled) {
                return 'canceled';
            } else if (!savePath) {
                throw new MainProcessError('Could not export error log.');
            };

            await fs.writeFile(savePath, content, { encoding: 'utf-8' });

            await sequelize.transaction(async () => {
                await ErrorLog.update({ pending: false }, { fields: ['pending'], where: { pending: true } });
                await ElectronErrorLog.update({ pending: false }, { fields: ['pending'], where: { pending: true } });
            });

            return 'sucess';

        } catch (err) {
            MainProcessError.catch(err);
            return 'error';
        };
    });
};