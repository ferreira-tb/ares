import { ipcSend } from "$global/ipc.js";
import type { ErrorLogBase, DOMErrorLogBase } from "$types/error.js";

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
};

export class GameDOMError extends Error {
    override readonly name = 'GameDOMError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: GameDOMError) {
        if (err instanceof GameDOMError) {
            ipcSend('set-dom-error-log', {
                selector: err.message
            } satisfies DOMErrorLogBase);
        };
    };
};