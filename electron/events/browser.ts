import { ipcMain } from 'electron';
import { assertMainWindow } from '$electron/utils/helpers.js';

export function setBrowserEvents() {
    const mainWindow = assertMainWindow();

    ipcMain.on('reload-browser-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-browser-window', () => mainWindow.webContents.reloadIgnoringCache());
};