import * as fs from 'node:fs/promises';
import { ipcMain, webContents } from 'electron';
import { sequelize } from '$electron/database';
import { appConfig } from '$electron/stores';
import { MainProcessError } from '$electron/error';
import { database } from '$electron/utils/files';
import { relaunch } from '$electron/utils/helpers';

export function setConfigEvents() {
    ipcMain.handle('config:get', (_e, configType: keyof AppConfigType) => {
        return { ...appConfig.get(configType) };
    });
    
    ipcMain.handle('config:should-reload-after-captcha', () => appConfig.get('general').reloadAfterCaptcha);
    ipcMain.handle('config:should-notify-on-error', () => appConfig.get('notifications').notifyOnError);

    ipcMain.on('config:update', <T extends keyof AppConfigType>(
        _e: Electron.IpcMainEvent, configType: T, value: AppConfigType[T]
    ) => {
        try {
            appConfig.set(configType, value);
            
            if (configType === 'tags') {
                for (const contents of webContents.getAllWebContents()) {
                    contents.send('config:did-update', configType);
                }
            }

        } catch (err) {
            MainProcessError.catch(err);
        }
    });

    ipcMain.handle('db:clear-database', async () => {
        try {
            await sequelize.close();
            if (!sequelize.isClosed) sequelize.isClosed = true;
            await fs.rm(database, { recursive: true, maxRetries: 5 });
            relaunch(3000);
            return true;
        } catch (err) {
            MainProcessError.catch(err);
            return false;
        }
    });
}