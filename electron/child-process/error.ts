import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { AresError } from '$common/error';

export class ChildProcessError extends AresError {
    public override readonly name = 'ChildProcessError';

    public static override async catch(err: unknown): Promise<void> {
        if (!process.env.USER_DATA_PATH) return;

        if (err instanceof Error) {
            const errorLog: OmitOptionalErrorLogProps<ElectronErrorLogType> = {
                name: err.name,
                message: err.message,
                stack: typeof err.stack === 'string' && err.stack.length > 0 ? err.stack : err.message,
                time: Date.now(),
                ares: process.env.ARES_VERSION ?? 'unknown',
                chrome: process.env.CHROME_VERSION ?? 'unknown',
                electron: process.env.ELECTRON_VERSION ?? 'unknown',
                tribal: process.env.TRIBAL_WARS_VERSION ?? 'unknown',
                locale: process.env.TRIBAL_WARS_LOCALE ?? 'unknown'
            };

            // Gera um arquivo de log com a data e a pilha de erros.
            const content = this.generateLogContent(errorLog);
            const logPath = path.join(process.env.USER_DATA_PATH, 'error.log');
            await fs.appendFile(logPath, content, { encoding: 'utf-8' });
        };
    };
};