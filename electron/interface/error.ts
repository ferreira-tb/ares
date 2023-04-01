import * as fs from 'fs/promises';
import * as path from 'path';
import { app, dialog, BrowserWindow } from 'electron';
import { isString, toNull } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database';
import { getActiveModule } from '$electron/app/modules';
import type { useAresStore } from '$interface/index';
import type { ElectronErrorLog as MainProcessErrorLogTable } from '$interface/index';
import type { ElectronProcessErrorLogType } from '$types/error';

export function catchError(
    aresStore: ReturnType<typeof useAresStore>,
    ElectronErrorLog: typeof MainProcessErrorLogTable
) {
    return async function (err: unknown) {
        try {
            if (err instanceof Error) {
                const errorLog: Omit<ElectronProcessErrorLogType, 'id' | 'pending'> = {
                    name: err.name,
                    message: err.message,
                    stack: toNull(err.stack, isString) as string | null,
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
            };

        } catch (anotherErr) {
            if (anotherErr instanceof Error) {
                try {
                    // Gera um arquivo de log com a data e a pilha de erros.
                    const date = new Date().toLocaleString('pt-br');
                    const logPath = path.join(app.getPath('userData'), 'ares_error.log');
                    const logContent = `${date}\n${(err as Error).stack}\n\n`;
                    await fs.appendFile(logPath, logContent);

                } catch {
                    // Se não for possível gerar o log, emite um alerta.
                    const errorMessage = `Contact the Ares team with the following error message:\n\n${(anotherErr as Error).message}`;
                    dialog.showErrorBox('CRITICAL ERROR', errorMessage);
                };
            };
        };
    };
};