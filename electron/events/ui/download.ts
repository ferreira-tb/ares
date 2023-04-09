import path from 'node:path';
import { ipcMain, shell } from 'electron';
import { isString } from '@tb-dev/ts-guard';
import { getMainWindow } from '$electron/utils/helpers';
import { getActiveModuleWebContents } from '$electron/app/modules';
import { DownloadError } from '$electron/error';
import type { DownloadItem } from 'electron';
import type { DownloadProgressType } from '$types/ares';

class DownloadProgress implements DownloadProgressType {
    readonly receivedBytes: number;
    readonly totalBytes: number;

    constructor(item: DownloadItem) {
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

function handleUpdateDownload(item: DownloadItem) {
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
                    const error = new DownloadError(err);
                    DownloadError.catch(error);
                };
            });

        } else if (contents) {
            contents.send('update-download-failed');
        };
    });
};