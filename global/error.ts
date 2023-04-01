import { isString } from '@tb-dev/ts-guard';
import { ipcSend, ipcInvoke } from '$global/ipc';

export class AresError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AresError';
    };

    public static async catch(err: unknown) {
        if (err instanceof Error) {
            const errorLog = {
                name: err.name,
                message: err.message,
                stack: isString(err.stack) ? err.stack : null
            };

            ipcSend('set-error-log', errorLog);
            const shouldNotify = await ipcInvoke('should-notify-on-error');
            if (shouldNotify) {
                new Notification(err.name, { body: err.message });
            };
        };
    };
};