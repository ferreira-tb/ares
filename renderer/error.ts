import { isString } from '$shared/guards';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { AresError } from '$shared/error';

export class RendererProcessError extends AresError {
    constructor(message: string) {
        super(message);
        this.name = 'AresError';
    };

    public static override async catch(err: unknown) {
        if (err instanceof Error) {
            const errorLog = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : err.message
            };

            ipcSend('error:create-log', errorLog);
            const shouldNotify = await ipcInvoke('should-notify-on-error');
            if (shouldNotify) {
                new Notification(err.name, { body: err.message });
            };
        };
    };
};