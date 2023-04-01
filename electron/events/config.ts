import { ipcMain } from 'electron';
import { showAppSettings } from '$electron/app/modules';
import { AppConfig, useAppGeneralConfigStore, useAppNotificationsStore } from '$interface/index';
import { MainProcessEventError } from '$electron/error';
import type { ConfigModuleRoutes } from '$types/modules';
import type { GeneralAppConfigType, AppNotificationsConfigType } from '$types/config';

export function setConfigEvents() {
    const appGeneralConfigStore = useAppGeneralConfigStore();
    const appNotificationsStore = useAppNotificationsStore();

    ipcMain.on('open-settings-window', (_e, route: ConfigModuleRoutes) => showAppSettings(route));
    ipcMain.handle('get-app-general-config', () => ({ ...appGeneralConfigStore }));
    ipcMain.handle('should-reload-after-captcha', () => appGeneralConfigStore.reloadAfterCaptcha);

    ipcMain.on('update-app-general-config', async (_e, config: GeneralAppConfigType) => {
        try {
            await AppConfig.setConfig('config_general', appGeneralConfigStore, config);
            await AppConfig.saveConfig('config_general', appGeneralConfigStore);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('update-app-notifications-config', async (_e, config: AppNotificationsConfigType) => {
        try {
            await AppConfig.setConfig('config_notifications', appNotificationsStore, config);
            await AppConfig.saveConfig('config_notifications', appNotificationsStore);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};