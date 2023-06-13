import { app, BrowserWindow } from 'electron';
import { isString } from '$common/guards';
import { sequelize } from '$electron/database';
import { getActiveModule } from '$electron/windows';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessError } from '$electron/error';
import { appConfig } from '$electron/stores';
import { ElectronErrorLog } from '$electron/database/models';

export async function errorHandler(err: unknown) {
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
                errorModule.webContents.send('error:did-create-electron-log', newRow.toJSON());
            };
        });

        const shouldNotify = appConfig.get('notifications').notifyOnError;
        if (shouldNotify) {
            const mainWindow = getMainWindow();
            mainWindow.webContents.send('notify-electron-error', errorLog);
        };

    } catch {
        await MainProcessError.log(err);
    };
};