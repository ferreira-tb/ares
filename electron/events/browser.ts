import { ipcMain } from 'electron';
import { useAresStore } from '$electron/interface';
import { getPanelWindow, getMainWindow } from '$electron/utils/helpers';

export function setBrowserEvents() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();
    const aresStore = useAresStore();

    ipcMain.on('update-captcha-status', (_e, status: boolean) => {
        aresStore.captcha = status;
        panelWindow.webContents.send('captcha-status-did-update', status);
    });

    ipcMain.handle('get-response-time', () => aresStore.responseTime);

    ipcMain.on('update-response-time', (_e, time: number) => {
        aresStore.responseTime = time;
        mainWindow.webContents.send('response-time-did-update', time);
    });
};