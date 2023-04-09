import { RendererProcessError } from '$renderer/error';

export class PhobosError extends RendererProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'PhobosError';
    };
};