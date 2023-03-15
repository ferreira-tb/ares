import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder';
import { setBrowserEvents } from '$electron/events/browser';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setDeimosEvents } from '$electron/events/deimos';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/window';
import { setCurrentViewEvents } from '$electron/events/view';
import { isUserAlias, isAllowedURL } from '$electron/utils/guards';
import { openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/app/modules';
import type { UserAlias } from '$types/electron';

import {
    useCacheStore,
    useWorldConfigStore,
    worldUnitsMap,
    useGroupsStore
} from '$interface/index';

import {
    getMainViewWebContents,
    getPanelWindow,
    getPlayerNameFromAlias,
    extractWorldUnitsFromMap
} from '$electron/utils/helpers';

export function setEvents() {
    
    const mainViewWebContents = getMainViewWebContents();
    const panelWindow = getPanelWindow();

    const cacheStore = useCacheStore();
    const worldConfigStore = useWorldConfigStore();
    const groupsStore = useGroupsStore();
    
    // Geral.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheStore.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');
    ipcMain.handle('main-view-url', () => mainViewWebContents.getURL());

    // Website.
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-repo-website', () => openRepoWebsite());
    ipcMain.on('open-issues-website', () => openIssuesWebsite());

    // Jogo.
    ipcMain.handle('current-world', () => cacheStore.world);
    ipcMain.handle('current-world-config', () => ({ ...worldConfigStore }));
    ipcMain.handle('current-world-units', () => extractWorldUnitsFromMap(worldUnitsMap));
    ipcMain.handle('is-archer-world', () => worldConfigStore.archer);

    ipcMain.handle('player-name', (_e, alias: UserAlias): string | null => {
        if (!isUserAlias(alias)) return cacheStore.player;
        return getPlayerNameFromAlias(alias);
    });

    ipcMain.handle('get-village-groups', () => groupsStore.all);

    // Informa ao painel que o navegador terminou de carregar.
    mainViewWebContents.on('did-finish-load', () => {
        panelWindow.webContents.send('browser-did-finish-load');
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainViewWebContents.on('will-navigate', (e, url) => {
        panelWindow.webContents.send('browser-will-navigate');
        if (!isAllowedURL(url)) e.preventDefault();
    });

    // Outros eventos.
    setMainWindowEvents();
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
    setCurrentViewEvents();
};