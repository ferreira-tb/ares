export class ClaustrophobicError extends Error {
    override readonly name = 'ClaustrophobicError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error) console.error(err);
    };

    public static reportDOMError(selector: string) {
        // Esse método deve ser usado para documentar erros relacionados ao DOM.
        console.error(selector);
    };
};

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new ClaustrophobicError(message);
};

export function assertInteger(item: any, message: string): asserts item is number {
    if (!Number.isInteger(item)) throw new TypeError(message);
};

export function assertFinite(item: any, message: string): asserts item is number {
    if (!Number.isFinite(item)) throw new TypeError(message);
};

export function assertType(condition: any, message: string): asserts condition {
    if (!condition) throw new TypeError(message);
};

export function assertDOM(condition: any, selector: string): asserts condition {
    if (!condition) {
        ClaustrophobicError.reportDOMError(selector);
        throw new ClaustrophobicError(selector);
    };
};

export function assertElement(item: any, selector: string): asserts item is Element {
    if (!(item instanceof Element)) {
        ClaustrophobicError.reportDOMError(selector);
        throw new ClaustrophobicError(selector);
    };
};