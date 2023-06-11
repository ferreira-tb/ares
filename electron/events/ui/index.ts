import { ipcMain } from 'electron';
import { setMainWindowDownloadEvents } from '$electron/events/ui/download';
import { setMenuEvents } from '$electron/events/ui/menu';
import { getMainWindow, maximizeOrRestoreWindow } from '$electron/utils/helpers';
import { appConfig } from '$electron/stores';

export function setMainWindowEvents() {
    const mainWindow = getMainWindow();

    ipcMain.on('ui:minimize', () => mainWindow.minimize());
    ipcMain.on('ui:close', () => mainWindow.close());
    ipcMain.handle('ui:maximize-or-restore', () => maximizeOrRestoreWindow(mainWindow));

    ipcMain.handle('ui:is-minimized', () => mainWindow.isMinimized());
    ipcMain.handle('ui:is-maximized', () => mainWindow.isMaximized());

    mainWindow.on('moved', saveBounds(mainWindow));
    mainWindow.on('resized', saveBounds(mainWindow));

    setMenuEvents();
    setMainWindowDownloadEvents();
};

function saveBounds(mainWindow: Electron.CrossProcessExports.BrowserWindow) {
    return function() {
        const rectangle = mainWindow.getBounds();
        appConfig.set('ui', { bounds: rectangle });
    };
};