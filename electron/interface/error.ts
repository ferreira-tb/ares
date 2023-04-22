import * as fs from 'fs/promises';
import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { storeToRefs } from 'mechanus';
import { isString } from '$global/guards';
import { sequelize } from '$electron/database';
import { getActiveModule } from '$electron/app/modules';
import { getMainWindow } from '$electron/utils/helpers';
import type { ElectronErrorLogBase } from '$types/error';
import type { useAresStore, useAppNotificationsStore } from '$electron/interface';
import type { ElectronErrorLog as ElectronErrorLogTable } from '$electron/interface';

export function catchError(
    aresStore: ReturnType<typeof useAresStore>,
    appNotificationsStore: ReturnType<typeof useAppNotificationsStore>,
    ElectronErrorLog: typeof ElectronErrorLogTable
) {
    const { notifyOnError } = storeToRefs(appNotificationsStore);
    return async function(err: unknown) {
        if (!(err instanceof Error)) return;
        try {
            const errorLog: ElectronErrorLogBase = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : null,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron,
                tribal: aresStore.majorVersion,
                locale: aresStore.locale
            };

            await sequelize.transaction(async (transaction) => {
                const newRow = await ElectronErrorLog.create(errorLog, { transaction });
                const errorModule = getActiveModule('error-log');
                if (errorModule instanceof BrowserWindow) {
                    errorModule.webContents.send('electron-error-log-did-update', newRow.toJSON());
                };
            });

            if (notifyOnError.value) {
                const mainWindow = getMainWindow();
                mainWindow.webContents.send('notify-electron-error', errorLog);
            };

        } catch {
            // Gera um arquivo de log com a data e a pilha de erros.
            const date = new Date().toLocaleString('pt-br');
            const logPath = path.join(app.getPath('userData'), 'ares-error.log');
            const content = `${date}\nAres: ${app.getVersion()} Electron: ${process.versions.electron}\n${err.stack}\n\n`;
            await fs.appendFile(logPath, content);
        };
    };
};