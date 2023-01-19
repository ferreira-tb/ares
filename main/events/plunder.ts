import { ipcMain } from 'electron';
import { plunderStore } from '#/store/plunder.js';
import type { BrowserWindow } from 'electron';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';

export function setPlunderEvents(mainWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => plunderStore.get('plunder-state.status', false));
    ipcMain.handle('get-plunder-state', () => plunderStore.get('plunder-state', null));
    ipcMain.handle('set-plunder-state', (_e, stateName: keyof PlunderState, value: PlunderStateValue) => {
        try {
            plunderStore.set(`plunder-state.${stateName}`, value);
            mainWindow.webContents.send('plunder-state-update', stateName, value);
            return true;
            
        } catch (err) {
            if (err instanceof Error) return err.message;
        };

        return false;
    });
};