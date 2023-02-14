export class DeimosError extends Error {
    override name = 'DeimosError';

    constructor(message: string) {
        super(message);
    };

    public static handle(err: unknown) {
        if (err instanceof Error && !(err instanceof ReferenceError)) {
            console.error(err);
        };
    };
};