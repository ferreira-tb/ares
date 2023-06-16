import { ipcMain } from 'electron';
import { useAresStore } from '$electron/stores';
import { MainWindow } from '$electron/windows';
import { setCaptchaEvents } from '$electron/events/browser/captcha';

export function setBrowserEvents() {
    const mainWindow = MainWindow.getInstance();
    const aresStore = useAresStore();

    ipcMain.handle('browser:get-response-time', () => aresStore.responseTime);

    ipcMain.on('browser:update-response-time', (_e, time: number) => {
        aresStore.responseTime = time;
        mainWindow.webContents.send('response-time-did-update', time);
    });

    setCaptchaEvents();
};