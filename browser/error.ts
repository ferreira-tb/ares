import { RendererProcessError } from '$renderer/error';

export class BrowserError extends RendererProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserError';
    };
};

export class BrowserRouterError extends BrowserError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserRouterError';
    };
};

export class BrowserEventError extends BrowserError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserEventError';
    };
};

export class PlunderError extends BrowserError {
    constructor(message: string) {
        super(message);
        this.name = 'PlunderError';
    };
};