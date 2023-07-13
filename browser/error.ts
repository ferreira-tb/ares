import { RendererProcessError } from '$renderer/error';

export class BrowserError extends RendererProcessError {
    public override readonly name = 'BrowserError';
}