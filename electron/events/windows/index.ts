import { ipcMain } from 'electron';
import { StandardWindow } from '$electron/windows';
import { setUpdateWindowEvents } from '$electron/events/windows/update';
import { StandardWindowName } from '$common/constants';

export function setWindowsEvents() {
    ipcMain.on('error:open-log-window', () => {
        StandardWindow.open(StandardWindowName.ErrorLog);
    });

    setUpdateWindowEvents();
};