import { ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { isUserAlias } from '$common/guards';
import { MainProcessEventError } from '$electron/error';
import { useAresStore, useCacheStore, usePlunderHistoryStore, PlunderHistory } from '$electron/interface';

export function setCaptchaEvents() {
    const aresStore = useAresStore();
    const { captcha } = storeToRefs(aresStore);

    const cacheStore = useCacheStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    ipcMain.on('captcha:update-status', (e, status: boolean) => {
        captcha.value = status;
        for (const contents of webContents.getAllWebContents()) {
            if (contents !== e.sender) {
                contents.send('captcha:status-did-update', status);
            };
        };
    });

    watch(captcha, async (status) => {
        try {
            if (!status) return;
            for (const contents of webContents.getAllWebContents()) {
                contents.send('plunder:stop');
            };

            if (isUserAlias(cacheStore.userAlias)) {
                await PlunderHistory.saveHistory(cacheStore.userAlias, plunderHistoryStore);
            };
            
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};