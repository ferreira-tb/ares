import { ipcMain } from 'electron';
import { useAresStore } from '$electron/stores';
import { getMainWindow } from '$electron/utils/helpers';
import { setCaptchaEvents } from '$electron/events/browser/captcha';

export function setBrowserEvents() {
    const mainWindow = getMainWindow();
    const aresStore = useAresStore();

    ipcMain.handle('browser:get-response-time', () => aresStore.responseTime);

    ipcMain.on('browser:update-response-time', (_e, time: number) => {
        aresStore.responseTime = time;
        mainWindow.webContents.send('response-time-did-update', time);
    });

    setCaptchaEvents();
};