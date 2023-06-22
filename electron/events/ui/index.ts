import { ipcMain } from 'electron';
import { MainWindow } from '$electron/windows';
import { setMainWindowDownloadEvents } from '$electron/events/ui/download';
import { setMenuEvents } from '$electron/events/ui/menu';

export function setMainWindowEvents() {
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('ui:minimize', () => mainWindow.minimize());
    ipcMain.on('ui:maximize', () => mainWindow.maximize());
    ipcMain.on('ui:close', () => mainWindow.close());

    ipcMain.handle('ui:is-maximized', () => mainWindow.isMaximized());
    
    setMenuEvents();
    setMainWindowDownloadEvents();
}