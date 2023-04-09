export class DeimosError extends Error {
    override name = 'DeimosError';

    public static catch(err: unknown) {
        if (err instanceof ReferenceError) return;
        if (err instanceof Error) console.error(err);
    };
};