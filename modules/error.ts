import { AresError } from '$global/error.js';

export class ModuleError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleError';
    };
};