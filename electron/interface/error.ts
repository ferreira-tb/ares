import * as fs from 'fs/promises';
import * as path from 'path';
import { app, dialog, BrowserWindow } from 'electron';
import { isInstanceOf, isString, toNull } from '@tb-dev/ts-guard';
import { sequelize } from '$database/database.js';
import { getActiveModule } from '$electron/app/modules.js';
import type { AresProxy } from '$stores/ares.js';
import type { MainProcessErrorLog as MainProcessErrorLogTable } from '$interface/index.js';
import type { MainProcessErrorLogType } from '$types/error.js';

export function catchError(
    aresProxy: AresProxy,
    MainProcessErrorLog: typeof MainProcessErrorLogTable
) {
    return async function (err: unknown) {
        try {
            if (isInstanceOf(err, Error)) {
                const errorLog: Omit<MainProcessErrorLogType, 'id' | 'pending'> = {
                    name: err.name,
                    message: err.message,
                    stack: toNull(err.stack, isString) as string | null,
                    time: Date.now(),
                    ares: app.getVersion(),
                    chrome: process.versions.chrome,
                    electron: process.versions.electron,
                    tribal: aresProxy.majorVersion,
                    locale: aresProxy.locale
                };

                await sequelize.transaction(async (transaction) => {
                    const newRow = await MainProcessErrorLog.create(errorLog, { transaction });
                    const errorModule = getActiveModule('error-log');
                    if (isInstanceOf(errorModule, BrowserWindow)) {
                        errorModule.webContents.send('main-process-error-log-updated', newRow.toJSON());
                    };
                });
            };

        } catch (anotherErr) {
            if (isInstanceOf(anotherErr, Error)) {
                try {
                    // Gera um arquivo de log com a data e a pilha de erros.
                    const date = new Date().toLocaleString('pt-br');
                    const logPath = path.join(app.getPath('userData'), 'ares_error.log');
                    const logContent = `${date}\n${(err as Error).stack}\n\n`;
                    await fs.appendFile(logPath, logContent);

                } catch {
                    // Se não for possível gerar o log, emite um alerta.
                    const errorMessage = `Um erro crítico ocorreu. Contate o desenvolvedor.\n\n${(err as Error).stack}`;
                    dialog.showErrorBox('ERRO CRÍTICO', errorMessage);
                };
            };
        };
    };
};