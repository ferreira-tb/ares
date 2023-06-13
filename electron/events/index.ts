import { app, dialog, ipcMain, webContents } from 'electron';
import { storeToRefs, watch } from 'mechanus';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setIpcTribalEvents } from '$electron/events/ipc-tribal';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/ui';
import { setBrowserViewEvents } from '$electron/events/view';
import { setBrowserEvents } from '$electron/events/browser';
import { setConfigEvents } from '$electron/events/config';
import { setDevEvents } from '$electron/events/dev';
import { setWorldEvents } from '$electron/events/world';
import { setGameEvents } from '$electron/events/game';
import { openAnyAllowedWebsite, openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/modules';
import { useCacheStore } from '$electron/stores';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessEventError } from '$electron/error';

export function setEvents() {
    const mainWindow = getMainWindow();
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);
    
    // Geral
    ipcMain.handle('user:get-alias', () => userAlias.value);
    ipcMain.handle('app:is-dev', () => process.env.ARES_MODE === 'dev');

    // Aplicação
    ipcMain.handle('app:name', () => app.getName());
    ipcMain.handle('app:version', () => app.getVersion());
    ipcMain.handle('app:locale', () => app.getLocale());
    ipcMain.handle('app:user-data-path', () => app.getPath('userData'));
    ipcMain.handle('app:desktop-path', () => app.getPath('desktop'));

    // Electron
    ipcMain.on('electron:show-message-box', (_e, options: ElectronMessageBoxOptions) => {
        dialog.showMessageBox(mainWindow, options).catch(MainProcessEventError.catch);
    });

    // Website
    ipcMain.on('open-any-allowed-website', (_e, url: string) => openAnyAllowedWebsite(url));
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-github-repo', () => openRepoWebsite());
    ipcMain.on('open-github-issues', () => openIssuesWebsite());

    watch(userAlias, (value) => {
        for (const contents of webContents.getAllWebContents()) {
            contents.send('user:did-change-alias', value);
        };
    });

    // Outros eventos
    setBrowserEvents();
    setBrowserViewEvents();
    setConfigEvents();
    setDevEvents();
    setErrorEvents();
    setGameEvents();
    setIpcTribalEvents();
    setMainWindowEvents();
    setModuleEvents();
    setPanelEvents();
    setWorldEvents();
};