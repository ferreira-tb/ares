import { app, BrowserWindow } from 'electron';
import { storeToRefs } from 'mechanus';
import { isString } from '$shared/guards';
import { sequelize } from '$electron/database';
import { getActiveModule } from '$electron/modules';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessError } from '$electron/error';
import type { useAppNotificationsStore } from '$electron/interface';
import type { ElectronErrorLog as ElectronErrorLogTable } from '$electron/interface';

export function catchError(
    appNotificationsStore: ReturnType<typeof useAppNotificationsStore>,
    ElectronErrorLog: typeof ElectronErrorLogTable
) {
    const { notifyOnError } = storeToRefs(appNotificationsStore);
    return async function(err: unknown) {
        if (!(err instanceof Error)) return;
        try {
            const errorLog: OmitOptionalErrorLogProps<ElectronErrorLogType> = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : err.message,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: process.env.TRIBAL_WARS_VERSION ?? 'unknown',
                locale: process.env.TRIBAL_WARS_LOCALE ?? 'unknown'
            };

            await sequelize.transaction(async () => {
                const newRow = await ElectronErrorLog.create(errorLog);
                const errorModule = getActiveModule('error-log');
                if (errorModule instanceof BrowserWindow) {
                    errorModule.webContents.send('error:electron-log-did-update', newRow.toJSON());
                };
            });

            if (notifyOnError.value) {
                const mainWindow = getMainWindow();
                mainWindow.webContents.send('notify-electron-error', errorLog);
            };

        } catch {
            await MainProcessError.log(err);
        };
    };
};