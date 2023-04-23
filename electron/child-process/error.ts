import { join } from 'node:path';
import { appendFile } from 'node:fs/promises';
import { AresError } from '$global/error';

export class ChildProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ChildProcessError';
    };

    public static override async catch(err: unknown) {
        if (!process.env.USER_DATA_PATH) return;
        process.env.ARES_VERSION ??= 'unknown version';
        process.env.ELECTRON_VERSION ??= 'unknown version';

        if (err instanceof Error) {
            // Gera um arquivo de log com a data e a pilha de erros.
            const date = new Date().toLocaleString('pt-br');
            const logPath = join(process.env.USER_DATA_PATH, 'child-process-error.log');
            const content = `${date}\nAres: ${process.env.ARES_VERSION} Electron: ${process.env.ELECTRON_VERSION}\n${err.stack}\n\n`;
            await appendFile(logPath, content);
        };
    };
};