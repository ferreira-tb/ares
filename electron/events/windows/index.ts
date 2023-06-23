import { ipcMain, Menu } from 'electron';
import { StandardWindow, WebsiteWindow } from '$electron/windows';
import { setUpdateWindowEvents } from '$electron/events/windows/update';
import { appConfig } from '$electron/stores';
import { StandardWindowName, type WebsiteUrl } from '$common/enum';

export function setWindowsEvents() {
    ipcMain.on('error:open-log-window', () => {
        StandardWindow.open(StandardWindowName.ErrorLog);
    });

    // Standard
    ipcMain.on('window:open', (_e, windowName: StandardWindowName) => {
        StandardWindow.open(windowName);
    });

    ipcMain.on('window:show-context-menu', (e, options: ContextMenuOptions) => {
        const devTools = appConfig.get('advanced').devTools;
        if (!devTools) return;

        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Inspecionar', click: () => e.sender.inspectElement(options.x, options.y) }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    });

    // Website
    ipcMain.on('website:any', (_e, url: string) => void WebsiteWindow.open(url));
    ipcMain.on('website:open', (_e, url: WebsiteUrl) => void WebsiteWindow.open(url));
    
    setUpdateWindowEvents();
}