import { AresError } from '$global/error';

export class ChildProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ChildProcessError';
    };

    public static override catch(err: unknown) {
        if (err instanceof Error) {
            return Promise.reject(new ChildProcessError(err.message));
        };

        return Promise.reject(new ChildProcessError('Unknown error.'));
    };
};