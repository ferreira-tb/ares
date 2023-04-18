export class DeimosError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DeimosError';
    };

    public static catch(err: unknown) {
        if (err instanceof ReferenceError) return;
        if (err instanceof Error) console.error(err);
    };
};

export class DeimosModelError extends DeimosError {
    constructor(message: string) {
        super(message);
        this.name = 'DeimosModelError';
    };
};