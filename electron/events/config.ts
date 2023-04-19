import { ipcMain } from 'electron';
import { showAppSettings } from '$electron/app/modules';
import { sequelize } from '$electron/database';
import { AppConfig, useAppGeneralConfigStore, useAppNotificationsStore } from '$electron/interface';
import { MainProcessEventError } from '$electron/error';
import { restartAres } from '$electron/utils/helpers';
import type { ConfigModuleRoutes } from '$types/modules';
import type { GeneralConfigType, NotificationsConfigType } from '$types/config';

export function setConfigEvents() {
    const appGeneralConfigStore = useAppGeneralConfigStore();
    const appNotificationsStore = useAppNotificationsStore();

    ipcMain.on('open-settings-window', (_e, route: ConfigModuleRoutes) => showAppSettings(route));
    ipcMain.handle('get-app-general-config', () => ({ ...appGeneralConfigStore }));
    ipcMain.handle('get-app-notifications-config', () => ({ ...appNotificationsStore }));
    ipcMain.handle('should-reload-after-captcha', () => appGeneralConfigStore.reloadAfterCaptcha);
    ipcMain.handle('should-notify-on-error', () => appNotificationsStore.notifyOnError);

    ipcMain.handle('drop-database', async () => {
        try {
            await sequelize.drop();
            setTimeout(() => restartAres(), 3000);
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.on('update-app-general-config', async (_e, config: GeneralConfigType) => {
        try {
            await AppConfig.setConfig('config_general', appGeneralConfigStore, config);
            await AppConfig.saveConfig('config_general', appGeneralConfigStore);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('update-app-notifications-config', async (_e, config: NotificationsConfigType) => {
        try {
            await AppConfig.setConfig('config_notifications', appNotificationsStore, config);
            await AppConfig.saveConfig('config_notifications', appNotificationsStore);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};