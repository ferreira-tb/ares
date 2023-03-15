import { ipcMain } from 'electron';
import { getMainViewWebContents } from '$electron/utils/helpers.js';

export function setBrowserEvents() {
    const mainViewWebContents = getMainViewWebContents();

    ipcMain.on('reload-main-view', () => mainViewWebContents.reload());
    ipcMain.on('force-reload-main-view', () => mainViewWebContents.reloadIgnoringCache());
};