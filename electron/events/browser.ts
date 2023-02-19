import { ipcMain } from 'electron';
import { getMainWindow } from '$electron/utils/helpers.js';

export function setBrowserEvents() {
    const mainWindow = getMainWindow();

    ipcMain.on('reload-browser-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-browser-window', () => mainWindow.webContents.reloadIgnoringCache());
};