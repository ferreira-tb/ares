import { ipcMain } from 'electron';
import { useAresStore } from '$electron/interface';
import { getPanelWindow } from '$electron/utils/helpers';

export function setBrowserEvents() {
    const panelWindow = getPanelWindow();
    const aresStore = useAresStore();

    ipcMain.on('update-captcha-status', (_e, status: boolean) => {
        aresStore.captcha = status;
        panelWindow.webContents.send('captcha-status-did-update', status);
    });
};