export class IpcTribalError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IpcTribalError';
    };

    public static catch(err: unknown) {
        if (err instanceof ReferenceError) return;
        if (err instanceof Error) console.error(err);
    };
};

export class IpcTribalModelError extends IpcTribalError {
    constructor(message: string) {
        super(message);
        this.name = 'IpcTribalModelError';
    };
};