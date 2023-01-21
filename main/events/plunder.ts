import { ipcMain } from 'electron';
import { assertType, MainProcessError } from '#/error.js';
import { plunderStore } from '#/store/plunder.js';
import { getCurrentWorld } from '#/helpers.js';
import type { BrowserWindow } from 'electron';

export function setPlunderEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => {
        const world = getCurrentWorld(mainWindow);
        if (world === null) return false;
        return plunderStore.get(`plunder-state.${world}.status`, false);
    });

    ipcMain.handle('get-plunder-state', () => {
        const world = getCurrentWorld(mainWindow);
        if (world === null) return null;
        return plunderStore.get(`plunder-state.${world}`, null);
    });

    ipcMain.on('set-plunder-state', (_e, stateName: unknown, value: unknown) => {
        try {
            const world = getCurrentWorld(mainWindow);
            assertType(typeof world === 'string', 'O mundo é inválido.');
            assertType(typeof stateName === 'string', 'O nome do estado é inválido.');
            
            plunderStore.set(`plunder-state.${world}.${stateName}`, value);
            mainWindow.webContents.send('plunder-state-update', stateName, value);
        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    ipcMain.on('update-plundered-amount', (_e, resources: unknown) => {
        if (resources) childWindow.webContents.send('update-plundered-amount', resources);
    });
};