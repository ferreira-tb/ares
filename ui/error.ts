import { RendererProcessError } from '$renderer/error';

export class MainWindowError extends RendererProcessError {
    constructor(message: string) {
        super(message);
        this.name = 'MainWindowError';
    };
};