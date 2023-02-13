import { ipcMain } from 'electron';
import { assertType, MainProcessError } from '$electron/error.js';
import { getCurrentWorld } from '$electron/helpers.js';
import { worldStore, setIntoWorldStore } from '$electron/stores/world.js';
import type { BrowserWindow } from 'electron';

export function setGameEvents(mainWindow: BrowserWindow, panelWindow: BrowserWindow) {
    // Recebe as coordenadas da janela mãe e então as envia para a janela filha.
    ipcMain.on('update-current-coords', (_e, currentX: unknown, currentY: unknown) => {
        try {
            assertType(typeof currentX === 'number', 'A coordenada X é inválida.');
            assertType(typeof currentY === 'number', 'A coordenada Y é inválida.');
            panelWindow.webContents.send('update-current-coords', currentX, currentY);

        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    // Retorna o mundo atual.
    ipcMain.handle('get-current-world', () => getCurrentWorld(mainWindow));
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