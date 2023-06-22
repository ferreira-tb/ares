import { app } from 'electron';
import { isString } from '$common/guards';
import { sequelize } from '$electron/database';
import { MainWindow, StandardWindow } from '$electron/windows';
import { MainProcessError } from '$electron/error';
import { appConfig } from '$electron/stores';
import { ElectronErrorLog } from '$electron/database/models';
import { StandardWindowName } from '$common/enum';

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
            const errorWindow = StandardWindow.getWindow(StandardWindowName.ErrorLog);
            errorWindow?.webContents.send('error:did-create-electron-log', newRow.toJSON());
        });

        const shouldNotify = appConfig.get('notifications').notifyOnError;
        if (shouldNotify) {
            const mainWindow = MainWindow.getInstance();
            mainWindow.webContents.send('notify-electron-error', errorLog);
        }

    } catch {
        await MainProcessError.log(err);
    }
}