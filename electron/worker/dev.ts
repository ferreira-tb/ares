import { BaseWindow } from '$electron/windows';
import { appIcon } from '$electron/utils/files';
import type { TribalWorker } from '$electron/worker';

export class TribalWorkerDebugger extends BaseWindow {
    constructor(worker: TribalWorker, session: Electron.Session) {
        super({
            width: 800,
            height: 600,
            useContentSize: true,
            show: true,
            minimizable: true,
            maximizable: true,
            resizable: true,
            fullscreenable: false,
            title: worker.name,
            icon: appIcon,
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
                contextIsolation: true,
                session
            }
        });
    }
}