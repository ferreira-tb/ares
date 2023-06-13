import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { URL } from 'node:url';
import { Op } from 'sequelize';
import { app, dialog, ipcMain, BrowserWindow } from 'electron';
import { MainProcessEventError } from '$electron/error';
import { sequelize } from '$electron/database';
import { getActiveModule } from '$electron/modules';
import { useAresStore } from '$electron/stores';
import { ErrorLog, ElectronErrorLog } from '$electron/database/models';
import { getMainWindow } from '$electron/utils/helpers';
import { ErrorLogFile } from '$common/constants';

export function setErrorEvents() {
    const aresStore = useAresStore();
    const mainWindow = getMainWindow();

    ipcMain.on('error:create-log', async (e, error: OmitOptionalErrorLogProps<ErrorLogBase>) => {
        try {
            const errorLog: OmitOptionalErrorLogProps<ErrorLogType> = {
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

            const newRow = await sequelize.transaction(async () => {
                const row = await ErrorLog.create(errorLog);
                return row;
            });

            const errorModule = getActiveModule('error-log');
            if (errorModule instanceof BrowserWindow) {
                errorModule.webContents.send('error:did-create-log', newRow.toJSON());
            };

        } catch (err) {
            MainProcessEventError.catch(err);
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
            MainProcessEventError.catch(err);
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
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.handle('error:export', async (): Promise<'canceled' | 'error' | 'sucess'> => {
        try {
            const normalErrors = await ErrorLog.findAll({ where: { pending: true } });
            const electronErrors = await ElectronErrorLog.findAll({ where: { pending: true } });
            const errors = [...normalErrors, ...electronErrors].sort((a, b) => a.time - b.time);
            if (errors.length === 0) return 'canceled';

            const asJson = errors.map((err) => err.toJSON()) as AllErrorLogTypes[];
            let content = MainProcessEventError.generateLogContent(asJson);

            const userData = app.getPath('userData');
            const uncaughtLogFilePath = path.join(userData, ErrorLogFile.Uncaught);
            content = await consumeLogFile(uncaughtLogFilePath, content);

            const childProcessFilePath = path.join(userData, ErrorLogFile.ChildProcess);
            content = await consumeLogFile(childProcessFilePath, content);

            const mergedLogPath = path.join(userData, ErrorLogFile.All);
            await fs.appendFile(mergedLogPath, content, { encoding: 'utf-8' });

            const defaultPath = `ares-error-log-${Date.now()}.log`;
            const { canceled, filePath: savePath } = await dialog.showSaveDialog(mainWindow, { defaultPath });

            if (canceled) {
                return 'canceled';
            } else if (!savePath) {
                throw new MainProcessEventError('Could not export error log.');
            };

            await fs.writeFile(savePath, content, { encoding: 'utf-8' });

            await sequelize.transaction(async () => {
                await ErrorLog.update({ pending: false }, { fields: ['pending'], where: { pending: true } });
                await ElectronErrorLog.update({ pending: false }, { fields: ['pending'], where: { pending: true } });
            });

            return 'sucess';

        } catch (err) {
            MainProcessEventError.catch(err);
            return 'error';
        };
    });
};

async function consumeLogFile(filePath: string, currentContent: string) {
    try {
        const newContent = await fs.readFile(filePath, { encoding: 'utf-8' });
        queueMicrotask(() => fs.rm(filePath).catch(MainProcessEventError.catch));
        return currentContent + newContent;
    } catch {
        return currentContent;
    };
};