import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { app } from 'electron';
import { AresError } from '$common/error';
import { isString } from '$common/guards';
import { ErrorLogFile } from '$common/constants';

export class MainProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

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

export class MechanusStoreError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'MechanusStoreError';
    };
};

export class DatabaseError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    };
};

export class MainProcessEventError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessEventError';
    };
};

export class ModuleCreationError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleCreationError';
    };
};

export class AliasInterfaceError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'AliasInterfaceError';
    };
};

export class WorldInterfaceError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'WorldInterfaceError';
    };
};

export class BrowserViewError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserViewError';
    };
};

export class DownloadError extends MainProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'DownloadError';
    };
};