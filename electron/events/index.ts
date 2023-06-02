import { app, dialog, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setIpcTribalEvents } from '$electron/events/ipc-tribal';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/ui';
import { setBrowserViewEvents } from '$electron/events/view';
import { setGroupsEvents } from '$electron/events/groups';
import { setBrowserEvents } from '$electron/events/browser';
import { setConfigEvents } from '$electron/events/config';
import { setDevEvents } from '$electron/events/dev';
import { setWorldDataEvents } from '$electron/events/world-data';
import { setGameEvents } from '$electron/events/game';
import { openAnyAllowedWebsite, openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/app/modules';
import { useCacheStore } from '$electron/interface';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessEventError } from '$electron/error';

export function setEvents() {
    const mainWindow = getMainWindow();
    const cacheStore = useCacheStore();
    
    // Geral.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheStore.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    ipcMain.on('electron:show-message-box', (_e, options: ElectronMessageBoxOptions) => {
        dialog.showMessageBox(mainWindow, options).catch(MainProcessEventError.catch);
    });

    // Website.
    ipcMain.on('open-any-allowed-website', (_e, url: string) => openAnyAllowedWebsite(url));
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-github-repo', () => openRepoWebsite());
    ipcMain.on('open-github-issues', () => openIssuesWebsite());

    // Outros eventos.
    setBrowserEvents();
    setBrowserViewEvents();
    setConfigEvents();
    setDevEvents();
    setErrorEvents();
    setGameEvents();
    setGroupsEvents();
    setIpcTribalEvents();
    setMainWindowEvents();
    setModuleEvents();
    setPanelEvents();
    setPlunderEvents();
    setWorldDataEvents();
};