import * as path from 'node:path';
import { ipcMain, shell } from 'electron';
import { isString } from '$common/guards';
import { getMainWindow } from '$electron/utils/helpers';
import { getActiveModuleWebContents } from '$electron/windows';
import { MainProcessEventError } from '$electron/error';

class DownloadProgress implements DownloadProgressType {
    readonly receivedBytes: number;
    readonly totalBytes: number;

    constructor(item: Electron.DownloadItem) {
        this.receivedBytes = item.getReceivedBytes();
        this.totalBytes = item.getTotalBytes();
    };
};

export function setMainWindowDownloadEvents() {
    const mainWindow = getMainWindow();
    const mainSession = mainWindow.webContents.session;

    ipcMain.on('download-from-url', (_e, url) => mainWindow.webContents.downloadURL(url));

    // O evento sempre assumirá que o download é uma atualização do Ares.
    mainSession.on('will-download', (_e, item) => {
        handleUpdateDownload(item);
    });
};

function handleUpdateDownload(item: Electron.DownloadItem) {
    const updateContents = getActiveModuleWebContents('app-update');
    if (updateContents) {
        updateContents.send('will-download-update', new DownloadProgress(item));
    };

    item.on('updated', (_e, state) => {
        if (state === 'progressing') {
            const contents = getActiveModuleWebContents('app-update');
            if (contents) {
                contents.send('update-download-progress', new DownloadProgress(item));
            };
        };
    });

    item.once('done', (_e, state) => {
        const contents = getActiveModuleWebContents('app-update');
        if (state === 'completed') {
            if (contents) {
                contents.send('update-download-completed');
            };
        
            const dirName = path.dirname(item.getSavePath());
            shell.openPath(dirName).catch((err: unknown) => {
                if (isString(err)) {
                    const error = new MainProcessEventError(err);
                    MainProcessEventError.catch(error);
                };
            });

        } else if (contents) {
            contents.send('update-download-failed');
        };
    });
};