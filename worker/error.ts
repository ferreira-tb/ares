import { RendererProcessError } from '$renderer/error';

export class TribalWorkerError extends RendererProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'TribalWorkerError';
    };
};