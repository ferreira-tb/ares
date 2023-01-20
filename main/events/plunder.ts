import { ipcMain } from 'electron';
import { MainProcessError } from '#/error.js';
import { plunderStore } from '#/store/plunder.js';
import type { BrowserWindow } from 'electron';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';

export function setPlunderEvents(mainWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => plunderStore.get('plunder-state.status', false));
    ipcMain.handle('get-plunder-state', () => plunderStore.get('plunder-state', null));

    ipcMain.on('set-plunder-state', (_e, stateName: keyof PlunderState, value: PlunderStateValue) => {
        try {
            plunderStore.set(`plunder-state.${stateName}`, value);
            mainWindow.webContents.send('plunder-state-update', stateName, value);    
        } catch (err) {
            MainProcessError.handle(err);
        };
    });
};