export class MainProcessError extends Error {
    override readonly name = 'MainProcessError';

    constructor(message: string) {
        super(message);
    };

    public static async capture(err: unknown) {
        if (err instanceof Error) console.error(err);
    };
};