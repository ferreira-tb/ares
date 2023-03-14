import { ipcMain } from 'electron';
import { getMainViewWebContents } from '$electron/utils/helpers.js';

export function setBrowserEvents() {
    const mainViewWebContents = getMainViewWebContents();

    ipcMain.on('reload-browser-window', () => mainViewWebContents.reload());
    ipcMain.on('force-reload-browser-window', () => mainViewWebContents.reloadIgnoringCache());
};