import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setDeimosEvents } from '$electron/events/deimos';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/ui';
import { setBrowserViewEvents } from '$electron/events/view';
import { setGroupsEvents } from '$electron/events/groups';
import { setBrowserEvents } from '$electron/events/browser';
import { setConfigEvents } from '$electron/events/config';
import { setDevEvents } from '$electron/events/dev';
import { isUserAlias } from '$global/guards';
import { openAnyAllowedWebsite, openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/app/modules';
import { useCacheStore, useWorldConfigStore, worldUnitsMap } from '$electron/interface';
import { getPlayerNameFromAlias, extractWorldUnitsFromMap } from '$electron/utils/helpers';
import type { UserAlias } from '$types/electron';

export function setEvents() {
    const cacheStore = useCacheStore();
    const worldConfigStore = useWorldConfigStore();
    
    // Geral.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheStore.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    // Website.
    ipcMain.on('open-any-allowed-website', (_e, url: string) => openAnyAllowedWebsite(url));
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-github-repo', () => openRepoWebsite());
    ipcMain.on('open-github-issues', () => openIssuesWebsite());

    // Jogo.
    ipcMain.handle('current-world', () => cacheStore.world);
    ipcMain.handle('current-world-config', () => ({ ...worldConfigStore }));
    ipcMain.handle('current-world-units', () => extractWorldUnitsFromMap(worldUnitsMap));
    ipcMain.handle('is-archer-world', () => worldConfigStore.archer);

    ipcMain.handle('player-name', (_e, alias: UserAlias): string | null => {
        if (!isUserAlias(alias)) return cacheStore.player;
        return getPlayerNameFromAlias(alias);
    });

    // Outros eventos.
    setDevEvents();
    setConfigEvents();
    setMainWindowEvents();
    setBrowserEvents();
    setBrowserViewEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
    setGroupsEvents();
};