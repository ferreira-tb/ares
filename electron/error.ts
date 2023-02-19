export class MainProcessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

    public static async catch(err: unknown) {
        if (err instanceof Error) console.error(err);
    };
};