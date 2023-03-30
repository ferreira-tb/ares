import { AresError } from '$global/error';

export class BrowserError extends AresError {
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

export class PlunderError extends BrowserError {
    constructor(message: string) {
        super(message);
        this.name = 'PlunderError';
    };
};