export class MainProcessError extends Error {
    override readonly name = 'MainProcessError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error) console.error(err);
    };
};

export function assert(condition: any, message: string): asserts condition {
    if (!condition) throw new MainProcessError(message);
};

export function assertType(condition: any, message: string): asserts condition {
    if (!condition) throw new TypeError(message);
};