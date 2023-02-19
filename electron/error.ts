export class MainProcessError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'MainProcessError';
    };

    declare public static catch: (err: unknown) => Promise<void>;
};