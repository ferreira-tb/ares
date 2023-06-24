import { ipcMain, Menu } from 'electron';
import { MainWindow, StandardWindow, WebsiteWindow } from '$electron/windows';
import { appConfig } from '$electron/stores';
import { StandardWindowName, WebsiteUrl } from '$common/enum';

export function setMenuEvents() {
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('menu:bug', () => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Registro de erros', click: () => void StandardWindow.open(StandardWindowName.ErrorLog) },
            { label: 'Problemas conhecidos', click: () => void WebsiteWindow.open(WebsiteUrl.Issues) }
        ];

        if (appConfig.get('advanced').debug) {
            template.push({ type: 'separator' });
            template.push({ label: 'Depurar', click: () => void StandardWindow.open(StandardWindowName.Debug) });
        }

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow.browser });
    });
}