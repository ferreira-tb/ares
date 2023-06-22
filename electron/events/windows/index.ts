import { ipcMain } from 'electron';
import { StandardWindow, WebsiteWindow } from '$electron/windows';
import { setUpdateWindowEvents } from '$electron/events/windows/update';
import { StandardWindowName, WebsiteUrl } from '$common/enum';

export function setWindowsEvents() {
    ipcMain.on('error:open-log-window', () => {
        StandardWindow.open(StandardWindowName.ErrorLog);
    });

    // Website
    ipcMain.on('website:any', (_e, url: string) => void WebsiteWindow.open(url));
    ipcMain.on('website:ares', () => void WebsiteWindow.open(WebsiteUrl.Ares));
    ipcMain.on('website:how-to-use', () => void WebsiteWindow.open(WebsiteUrl.HowToUse));
    ipcMain.on('website:issues', () => void WebsiteWindow.open(WebsiteUrl.Issues));
    ipcMain.on('website:repository', () => void WebsiteWindow.open(WebsiteUrl.Repository));
    
    setUpdateWindowEvents();
}