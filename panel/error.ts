import { AresError } from '$global/error.js';

export class PanelError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'PanelError';
    };
};