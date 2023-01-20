import { ipcMain } from 'electron';
import { assertType, MainProcessError } from '#/error.js';
import { plunderStore } from '#/store/plunder.js';
import type { BrowserWindow } from 'electron';

export function setPlunderEvents(mainWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => plunderStore.get('plunder-state.status', false));
    ipcMain.handle('get-plunder-state', () => plunderStore.get('plunder-state', null));

    ipcMain.on('set-plunder-state', (_e, stateName: unknown, value: unknown) => {
        try {
            assertType(typeof stateName === 'string', 'O nome do estado é inválido.');            
            plunderStore.set(`plunder-state.${stateName}`, value);
            mainWindow.webContents.send('plunder-state-update', stateName, value);    
        } catch (err) {
            MainProcessError.handle(err);
        };
    });
};