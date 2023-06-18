import { ipcMain } from 'electron';
import { useCacheStore } from '$electron/stores';
import { MainWindow } from '$electron/windows';
import { setCaptchaEvents } from '$electron/events/browser/captcha';
import { setContextMenuEvents } from '$electron/events/browser/menu';

export function setBrowserEvents() {
    const mainWindow = MainWindow.getInstance();
    const cacheStore = useCacheStore();

    ipcMain.handle('browser:get-response-time', () => cacheStore.responseTime);

    ipcMain.on('browser:update-response-time', (_e, time: number) => {
        cacheStore.responseTime = time;
        mainWindow.webContents.send('response-time-did-update', time);
    });

    setCaptchaEvents();
    setContextMenuEvents();
};