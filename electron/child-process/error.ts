import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { AresError } from '$shared/error';
import { isString } from '$shared/guards';
import { ErrorLogFile } from '$shared/constants';

export class ChildProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ChildProcessError';
    };

    public static override async catch(err: unknown): Promise<void> {
        if (!process.env.USER_DATA_PATH) return;

        if (err instanceof Error) {
            const errorLog: OmitOptionalErrorLogProps<ElectronErrorLogType> = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : err.message,
                time: Date.now(),
                ares: process.env.ARES_VERSION ?? 'unknown',
                chrome: process.env.CHROME_VERSION ?? 'unknown',
                electron: process.env.ELECTRON_VERSION ?? 'unknown',
                tribal: process.env.TRIBAL_WARS_VERSION ?? 'unknown',
                locale: process.env.TRIBAL_WARS_LOCALE ?? 'unknown'
            };

            // Gera um arquivo de log com a data e a pilha de erros.
            const content = this.generateLogContent(errorLog);
            const logPath = path.join(process.env.USER_DATA_PATH, ErrorLogFile.ChildProcess);
            await fs.appendFile(logPath, content, { encoding: 'utf-8' });
        };
    };
};