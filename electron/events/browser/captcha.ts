import { ipcMain, webContents } from 'electron';
import { storeToRefs } from 'mechanus';
import { useBrowserStore } from '$electron/stores';

export function setCaptchaEvents() {
    const browserStore = useBrowserStore();
    const { captcha } = storeToRefs(browserStore);

    ipcMain.on('captcha:update-status', (e, status: boolean) => {
        captcha.value = status;
        for (const contents of webContents.getAllWebContents()) {
            if (contents !== e.sender) {
                contents.send('captcha:did-update-status', status);
            }
        }
    });
}