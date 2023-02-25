import { AresError } from '$global/error.js';

export class ModuleError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleError';
    };
};

export class ModuleConfigError extends ModuleError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleConfigError';
    };
};