import { AresError } from '$global/error';

export class MainWindowError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'MainWindowError';
    };
};