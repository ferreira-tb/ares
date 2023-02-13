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

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new AresError(message);
};

export function assertArrayIncludes<T>(array: T[], item: any, message: string): asserts item is T {
    if (!array.includes(item)) throw new TypeError(message);
};

export function assertInteger(item: any, message?: string): asserts item is number {
    if (!message) message = 'O número não é um inteiro.';
    if (!Number.isInteger(item)) throw new TypeError(message);
};

export function assertFinite(item: any, message?: string): asserts item is number {
    if (!message) message = 'O número não é finito.';
    if (!Number.isFinite(item)) throw new TypeError(message);
};

export function assertType(condition: any, message: string): asserts condition {
    if (!condition) throw new TypeError(message);
};

export function assertDOM(condition: any, selector: string): asserts condition {
    if (!condition) throw new GameDOMError(selector);
};

export function assertElement(item: any, selector: string): asserts item is Element {
    if (!(item instanceof Element)) throw new GameDOMError(selector);
};