import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { app } from 'electron';
import { AresError } from '$common/error';
import { isString } from '$common/guards';
import { ErrorLogFile } from '$common/constants';

export class MainProcessError extends AresError {
    public override name = 'MainProcessError';

    /** Emite um erro falso no processo principal para fins de teste. */
    public static mock() {
        const error = new this('This is a mock error.');
        this.catch(error);
    };

    /** Gera um arquivo de log com a data e a pilha de erros. */
    public static async log(err: unknown) {
        if (!(err instanceof Error)) return;

        const errorLog: OmitOptionalErrorLogProps<ElectronErrorLogType> = {
            name: err.name,
            message: err.message,
            stack: isString(err.stack) ? err.stack : null,
            time: Date.now(),
            ares: app.getVersion(),
            chrome: process.versions.chrome,
            electron: process.versions.electron,
            tribal: process.env.TRIBAL_WARS_VERSION ?? 'unknown',
            locale: process.env.TRIBAL_WARS_LOCALE ?? 'unknown'
        };

        const content = this.generateLogContent(errorLog);
        const logPath = path.join(app.getPath('userData'), ErrorLogFile.Uncaught);
        await fs.appendFile(logPath, content, { encoding: 'utf-8' });
    };
};

export class DatabaseError extends MainProcessError {
    public override readonly name = 'DatabaseError';
};

export class TribalWorkerError extends MainProcessError {
    public override readonly name = 'TribalWorkerError';
};

export class StandardWindowError extends MainProcessError {
    public override readonly name = 'StandardWindowError';
};

export class WebsiteWindowError extends MainProcessError {
    public override readonly name = 'WebsiteWindowError';
};

export class BrowserTabError extends MainProcessError {
    public override readonly name = 'BrowserTabError';
};