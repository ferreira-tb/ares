import { RendererProcessError } from '$renderer/error';

export class TribalWorkerError extends RendererProcessError {
    public override readonly name = 'TribalWorkerError';

    public static onMessageError(message: MessageEvent<unknown>) {
        if (message.data instanceof Error) {
            this.catch(message.data);
        } else {
            const error = new TribalWorkerError(String(message.data));
            this.catch(error);
        };
    };
};