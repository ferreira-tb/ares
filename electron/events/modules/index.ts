import { ipcMain } from 'electron';
import { showErrorLog } from '$electron/windows';
import { setAppUpdateModuleEvents } from '$electron/events/modules/update';

export function setModuleEvents() {
    ipcMain.on('error:open-log-window', () => showErrorLog());

    setAppUpdateModuleEvents();
};