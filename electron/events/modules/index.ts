import { ipcMain } from 'electron';
import { showErrorLog } from '$electron/app/modules';
import { setAppUpdateModuleEvents } from '$electron/events/modules/update';

export function setModuleEvents() {
    ipcMain.on('error:open-log-window', () => showErrorLog());

    setAppUpdateModuleEvents();
};