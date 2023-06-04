import { ipcMain } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';

export function setTribalWorkerEvents() {
    const mainWindow = getMainWindow();

    ipcMain.on('tribal-worker:will-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:will-handle-incoming-attack');
    });

    ipcMain.on('tribal-worker:did-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:did-handle-incoming-attack');
    });

    ipcMain.on('tribal-worker:did-fail-to-handle-incoming-attack', () => {
        mainWindow.webContents.send('tribal-worker:did-fail-to-handle-incoming-attack');
    });
};