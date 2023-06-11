import { RendererProcessError } from '$renderer/error';

export class TribalWorkerError extends RendererProcessError {
    public override readonly name = 'TribalWorkerError';

    public static async onMessageError(message: MessageEvent<unknown>) {
        if (message.data instanceof Error) {
            await this.catch(message.data);
        } else {
            const error = new TribalWorkerError(String(message.data));
            await this.catch(error);
        };
    };
};