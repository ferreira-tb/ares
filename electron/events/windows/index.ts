import { ipcMain } from 'electron';
import { StandardWindow, WebsiteWindow } from '$electron/windows';
import { setUpdateWindowEvents } from '$electron/events/windows/update';
import { StandardWindowName, type WebsiteUrl } from '$common/enum';

export function setWindowsEvents() {
    ipcMain.on('error:open-log-window', () => {
        StandardWindow.open(StandardWindowName.ErrorLog);
    });

    // Standard
    ipcMain.on('window:open', (_e, windowName: StandardWindowName) => {
        StandardWindow.open(windowName);
    });

    // Website
    ipcMain.on('website:any', (_e, url: string) => void WebsiteWindow.open(url));
    ipcMain.on('website:open', (_e, url: WebsiteUrl) => void WebsiteWindow.open(url));
    
    setUpdateWindowEvents();
}