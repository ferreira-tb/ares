import { app, dialog, ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { MainWindow } from '$electron/windows';
import { setBrowserEvents } from '$electron/events/browser';
import { setConfigEvents } from '$electron/events/config';
import { setDevEvents } from '$electron/events/dev';
import { setErrorEvents } from '$electron/events/error';
import { setGameEvents } from '$electron/events/game';
import { setIpcTribalEvents } from '$electron/events/ipc-tribal';
import { setPanelEvents } from '$electron/events/panel';
import { setTabEvents } from '$electron/events/tabs';
import { setMainWindowEvents } from '$electron/events/ui';
import { setWindowsEvents } from '$electron/events/windows';
import { setWorkerEvents } from '$electron/events/worker';
import { setWorldEvents } from '$electron/events/world';
import { useCacheStore } from '$electron/stores';
import { MainProcessError } from '$electron/error';

export function setEvents() {
    const mainWindow = MainWindow.getInstance();
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);
    
    // Geral
    ipcMain.handle('user:get-alias', () => userAlias.value);
    
    // Aplicação
    ipcMain.handle('app:name', () => app.getName());
    ipcMain.handle('app:version', () => app.getVersion());
    ipcMain.handle('app:locale', () => app.getLocale());
    ipcMain.handle('app:is-dev', () => process.env.ARES_MODE === 'dev');
    ipcMain.handle('app:user-data-path', () => app.getPath('userData'));
    ipcMain.handle('app:desktop-path', () => app.getPath('desktop'));

    // Electron
    ipcMain.on('electron:show-message-box', (_e, options: MessageBoxOptions) => {
        dialog.showMessageBox(mainWindow.browser, options).catch(MainProcessError.catch);
    });

    watch(userAlias, (value) => {
        for (const contents of webContents.getAllWebContents()) {
            contents.send('user:did-change-alias', value);
        };
    });

    // Outros eventos
    setBrowserEvents();
    setConfigEvents();
    setDevEvents();
    setErrorEvents();
    setGameEvents();
    setIpcTribalEvents();
    setMainWindowEvents();
    setPanelEvents();
    setTabEvents();
    setWindowsEvents();
    setWorkerEvents();
    setWorldEvents();
};