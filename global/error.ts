import { ipcSend } from '$global/ipc.js';
import { toNull, isString } from '@tb-dev/ts-guard';
import type { ErrorLogBase, DOMErrorLogBase } from '$types/error.js';

export class AresError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AresError';
    };

    public static catch(err: unknown) {
        if (err instanceof Error) {
            const errorLog = {
                name: err.name,
                stack: toNull(err.stack, isString) as string | null,
            };

            if (err.name === 'DOMAssertionError') {
                ipcSend('set-dom-error-log', { ...errorLog, selector: err.message } satisfies DOMErrorLogBase);
            } else {
                ipcSend('set-error-log', { ...errorLog, message: err.message } satisfies ErrorLogBase);
            };
        };
    };
};