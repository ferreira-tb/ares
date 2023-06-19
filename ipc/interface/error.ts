export class IpcTribalError extends Error {
    public override readonly name = 'IpcTribalError';

    public static catch(err: unknown) {
        if (err instanceof ReferenceError) return;
        if (err instanceof Error) console.error(err);
    };
};