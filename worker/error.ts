import { RendererProcessError } from '$renderer/error';

export class TribalWorkerError extends RendererProcessError {
    public override readonly name = 'TribalWorkerError';
};