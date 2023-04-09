export class AresError extends Error {
    declare public static catch: (err: unknown) => Promise<void>;

    constructor(message: string) {
        super(message);
        this.name = 'AresError';
    };
};