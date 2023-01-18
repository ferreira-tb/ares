export class ClaustrophobicError extends Error {
    override readonly name = 'ClaustrophobicError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error) console.error(err);
    };

    public static handleDOMError(selector: string) {
        // Esse método deve ser usado para documentar erros relacionados ao DOM.
        console.error(selector);
    };
};

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new ClaustrophobicError(message);
};

export function assertDOM(condition: any, selector: string): asserts condition {
    if (!condition) {
        ClaustrophobicError.handleDOMError(selector);
        throw new ClaustrophobicError(selector);
    };
};