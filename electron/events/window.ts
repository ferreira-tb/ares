import { ipcMain } from 'electron';
import { getMainWindow, maximizeOrRestoreWindow } from '$electron/utils/helpers';

export function setMainWindowEvents() {
    const mainWindow = getMainWindow();

    ipcMain.on('minimize-main-window', () => mainWindow.minimize());
    ipcMain.on('close-main-window', () => mainWindow.close());
    ipcMain.handle('maximize-or-restore-main-window', () => maximizeOrRestoreWindow(mainWindow));

    ipcMain.handle('is-main-window-minimized', () => mainWindow.isMinimized());
    ipcMain.handle('is-main-window-maximized', () => mainWindow.isMaximized());

    // Menu da janela principal.
};