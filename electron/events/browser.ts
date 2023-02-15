import { ipcMain } from 'electron';
import { assertMainWindow } from '$electron/utils/helpers.js';
import { worldStore, setIntoWorldStore } from '$electron/electron-store/world.js';

export function setBrowserEvents() {
    const mainWindow = assertMainWindow();

    ipcMain.on('reload-browser-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-browser-window', () => mainWindow.webContents.reloadIgnoringCache());

    // Indica se as configurações do mundo ou das unidades estão salvas no armazenamento.
    ipcMain.handle('has-world-data', (_e, world: string) => worldStore.has(`world-info.${world}`));
    ipcMain.handle('has-unit-data', (_e, world: string) => worldStore.has(`unit-info.${world}`));

    // Salvas as configurações no armazenamento.
    ipcMain.handle('set-world-data', (_e, world: string, data: unknown) => {
        return setIntoWorldStore(`world-info.${world}`, data);
    });

    ipcMain.handle('set-unit-data', (_e, world: string, data: unknown) => {
        return setIntoWorldStore(`unit-info.${world}`, data);
    });
};