import * as path from 'node:path';
import { ipcMain, shell } from 'electron';
import { isString } from '$common/guards';
import { MainWindow } from '$electron/windows';
import { StandardWindow } from '$electron/windows';
import { MainProcessError } from '$electron/error';
import { StandardWindowName } from '$common/constants';

class DownloadProgress implements DownloadProgressType {
    public readonly receivedBytes: number;
    public readonly totalBytes: number;

    constructor(item: Electron.DownloadItem) {
        this.receivedBytes = item.getReceivedBytes();
        this.totalBytes = item.getTotalBytes();
    };
};

export function setMainWindowDownloadEvents() {
    const mainWindow = MainWindow.getInstance();
    const mainSession = mainWindow.webContents.session;

    ipcMain.on('download-from-url', (_e, url) => mainWindow.webContents.downloadURL(url));

    // O evento sempre assumirá que o download é uma atualização do Ares.
    mainSession.on('will-download', (_e, item) => {
        handleUpdateDownload(item);
    });
};

function handleUpdateDownload(item: Electron.DownloadItem) {
    const updateContents = StandardWindow.getWindow(StandardWindowName.Update)?.webContents;
    updateContents?.send('will-download-update', new DownloadProgress(item));

    item.on('updated', (_e, state) => {
        if (state === 'progressing') {
            const contents = StandardWindow.getWindow(StandardWindowName.Update)?.webContents;
            contents?.send('update-download-progress', new DownloadProgress(item));
        };
    });

    item.once('done', (_e, state) => {
        const contents = StandardWindow.getWindow(StandardWindowName.Update)?.webContents;
        if (state === 'completed') {
            contents?.send('update-download-completed');
        
            const dirName = path.dirname(item.getSavePath());
            shell.openPath(dirName).catch((err: unknown) => {
                if (isString(err)) {
                    const error = new MainProcessError(err);
                    MainProcessError.catch(error);
                };
            });

        } else if (contents) {
            contents.send('update-download-failed');
        };
    });
};