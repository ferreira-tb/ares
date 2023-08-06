export class IpcTribalError extends Error {
    public override readonly name = 'IpcTribalError';

    public static catch(err: unknown) {
        if (err instanceof ReferenceError) return;

        // Ainda não implementado.
        // eslint-disable-next-line no-console
        if (err instanceof Error) console.error(err);
    }
}