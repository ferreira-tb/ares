import { ipcSend } from '$global/ipc.js';
import type { ErrorLogBase, DOMErrorLogBase } from '$types/error.js';

export class AresError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AresError';
    };

    public static catch(err: unknown) {
        if (err instanceof Error) {
            if (err.name === 'DOMAssertionError') {
                ipcSend('set-dom-error-log', { selector: err.message } satisfies DOMErrorLogBase);
            } else {
                ipcSend('set-error-log', { name: err.name, message: err.message } satisfies ErrorLogBase);
            };
        };
    };
};