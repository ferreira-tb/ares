export class DeimosError extends Error {
    override name = 'DeimosError';

    constructor(message: string) {
        super(message);
    };

    public static capture(err: unknown) {
        if (err instanceof ReferenceError) return;
        if (err instanceof Error) console.error(err);
    };
};