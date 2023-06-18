import { isString } from '$common/guards';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { AresError } from '$common/error';

export class RendererProcessError extends AresError {
    public override name = 'RendererProcessError';

    public static override async catch(err: unknown) {
        if (err instanceof Error) {
            const errorLog = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : err.message
            };

            ipcSend('error:create-log', errorLog);
            const shouldNotify = await ipcInvoke('config:should-notify-on-error');
            if (shouldNotify) {
                new Notification(err.name, { body: err.message });
            };
        };
    };
};

export class RendererWorkerError extends RendererProcessError {
    public override readonly name = 'RendererWorkerError';
};