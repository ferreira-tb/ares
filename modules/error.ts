import { AresError } from '$global/error';

export class ModuleError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleError';
    };
};

export class ModuleRouterError extends ModuleError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleRouterError';
    };
};

export class ModuleAppUpdateError extends ModuleError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleAppUpdateError';
    };
};

export class ModuleConfigError extends ModuleError {
    constructor(message: string) {
        super(message);
        this.name = 'ModuleConfigError';
    };
};