import { AresError } from '$global/error.js';

export class BrowserError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'BrowserError';
    };
};

export class PlunderError extends BrowserError {
    constructor(message: string) {
        super(message);
        this.name = 'PlunderError';
    };
};