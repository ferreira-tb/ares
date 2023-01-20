import { ipcMain } from 'electron';
import { assert } from '#/error.js';
import type { BrowserWindow } from 'electron';

export function setGameEvents(childWindow: BrowserWindow) {
    // Recebe as coordenadas da janela mãe e então as envia para a janela filha.
    ipcMain.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        assert(typeof currentX === 'number', 'A coordenada X é inválida.');
        assert(typeof currentY === 'number', 'A coordenada Y é inválida.');
        childWindow.webContents.send('update-current-coords', currentX, currentY);
    });
};