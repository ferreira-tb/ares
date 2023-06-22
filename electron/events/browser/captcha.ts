import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { isUserAlias } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { useCacheStore } from '$electron/stores';
import { PlunderHistory } from '$electron/database/models';

export function setCaptchaEvents() {
    const cacheStore = useCacheStore();
    const { captcha, userAlias } = storeToRefs(cacheStore);

    ipcMain.on('captcha:update-status', (e, status: boolean) => {
        captcha.value = status;
        for (const contents of webContents.getAllWebContents()) {
            if (contents !== e.sender) {
                contents.send('captcha:did-update-status', status);
            }
        }
    });

    watch(captcha, async (status) => {
        try {
            if (!status) return;
            for (const contents of webContents.getAllWebContents()) {
                contents.send('plunder:stop');
            }

            const alias = userAlias.value;
            if (isUserAlias(alias)) {
                await PlunderHistory.saveHistory(alias);
            }
            
        } catch (err) {
            MainProcessError.catch(err);
        }
    });
}