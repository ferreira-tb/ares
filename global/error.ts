import { ipcSend } from '$global/ipc.js';
import { DOMAssertionError } from '@tb-dev/ts-guard-dom';
import type { ErrorLogBase, DOMErrorLogBase } from '$types/error.js';

export class AresError extends Error {
    override name = 'AresError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error) {
            ipcSend('set-error-log', {
                name: err.name,
                message: err.message
            } satisfies ErrorLogBase);
        };
    };

    public static handleDOMError(err: unknown) {
        if (err instanceof DOMAssertionError) {
            ipcSend('set-dom-error-log', {
                selector: err.message
            } satisfies DOMErrorLogBase);
        };
    };
};