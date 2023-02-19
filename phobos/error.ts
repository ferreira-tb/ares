import { AresError } from '$global/error.js';

export class PhobosError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'PhobosError';
    };
};