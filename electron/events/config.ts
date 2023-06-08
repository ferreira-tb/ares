import * as fs from 'node:fs/promises';
import { ipcMain } from 'electron';
import { showAppSettings } from '$electron/modules';
import { sequelize } from '$electron/database';
import { appConfig } from '$electron/stores';
import { MainProcessEventError } from '$electron/error';
import { database } from '$electron/utils/files';
import { restartAres } from '$electron/utils/helpers';

export function setConfigEvents() {
    ipcMain.on('config:open', (_e, route: ConfigModuleRoutes) => showAppSettings(route));
    ipcMain.handle('config:general', () => ({ ...appConfig.get('general') }));
    ipcMain.handle('config:notifications', () => ({ ...appConfig.get('notifications') }));
    
    ipcMain.handle('config:should-reload-after-captcha', () => appConfig.get('general').reloadAfterCaptcha);
    ipcMain.handle('config:should-notify-on-error', () => appConfig.get('notifications').notifyOnError);

    ipcMain.on('config:update', <T extends keyof AppConfigType>(
        _e: unknown, configType: T, value: AppConfigType[T]
    ) => {
        try {
            appConfig.set(configType, value);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('db:clear-database', async () => {
        try {
            await sequelize.close();
            if (!sequelize.isClosed) sequelize.isClosed = true;
            await fs.rm(database, { recursive: true, maxRetries: 5 });
            setTimeout(() => restartAres(), 3000);
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};