import { ipcMain } from 'electron';
import { showAppSettings } from '$electron/app/modules';
import { useAppGeneralConfigStore, AppConfig } from '$interface/index';
import { MainProcessEventError } from '$electron/error';
import type { ConfigModuleRoutes } from '$types/modules';
import type { GeneralAppConfigType } from '$types/config';

export function setConfigEvents() {
    const appGeneralConfigStore = useAppGeneralConfigStore();

    ipcMain.on('open-settings-window', (_e, route: ConfigModuleRoutes) => showAppSettings(route));
    ipcMain.handle('get-app-general-config', () => ({ ...appGeneralConfigStore }));
    ipcMain.handle('should-reload-after-captcha', () => appGeneralConfigStore.reloadAfterCaptcha);

    ipcMain.on('update-app-general-config', async (_e, config: GeneralAppConfigType) => {
        try {
            type ConfigEntries = [keyof GeneralAppConfigType, GeneralAppConfigType[keyof GeneralAppConfigType]][];
            for (const [key, value] of Object.entries(config) as ConfigEntries) {
                if (appGeneralConfigStore[key] === value) continue;
                appGeneralConfigStore[key] = value;
            };

            await AppConfig.saveGeneralConfig(appGeneralConfigStore);
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};