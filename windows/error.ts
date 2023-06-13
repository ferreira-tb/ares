import { RendererProcessError } from '$renderer/error';

export class ModuleError extends RendererProcessError {
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