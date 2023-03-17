import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder';
import { setErrorEvents } from '$electron/events/error';
import { setPanelEvents } from '$electron/events/panel';
import { setDeimosEvents } from '$electron/events/deimos';
import { setModuleEvents } from '$electron/events/modules';
import { setMainWindowEvents } from '$electron/events/window';
import { setBrowserViewEvents } from '$electron/events/view';
import { setGroupsEvents } from '$electron/events/groups';
import { isUserAlias } from '$electron/utils/guards';
import { openAresWebsite, openIssuesWebsite, openRepoWebsite, showAppSettings } from '$electron/app/modules';
import type { UserAlias } from '$types/electron';
import type { ConfigModuleRoutes } from '$types/modules';

import {
    useCacheStore,
    useWorldConfigStore,
    worldUnitsMap
} from '$interface/index';

import {
    getPlayerNameFromAlias,
    extractWorldUnitsFromMap
} from '$electron/utils/helpers';

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

    // Configurações.
    ipcMain.on('open-settings-window', (_e, route: ConfigModuleRoutes) => showAppSettings(route));

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

    // Outros eventos.
    setMainWindowEvents();
    setBrowserViewEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
    setGroupsEvents();
};