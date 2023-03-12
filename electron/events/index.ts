import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setBrowserEvents } from '$electron/events/browser.js';
import { setErrorEvents } from '$electron/events/error.js';
import { setPanelEvents } from '$electron/events/panel.js';
import { setDeimosEvents } from '$electron/events/deimos.js';
import { setModuleEvents } from '$electron/events/modules.js';
import { getMainWindow, getPanelWindow, getPlayerNameFromAlias, insertCSS } from '$electron/utils/helpers.js';
import { cacheProxy, worldConfigProxy, worldUnitProxy } from '$interface/index.js';
import { isUserAlias, isAllowedURL } from '$electron/utils/guards.js';
import { openAresWebsite, openIssuesWebsite, openRepoWebsite } from '$electron/app/modules.js';
import type { UserAlias } from '$types/electron.js';

export function setEvents() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    // Geral.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheProxy.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');
    ipcMain.handle('main-window-url', () => mainWindow.webContents.getURL());

    // Website.
    ipcMain.on('open-ares-website', () => openAresWebsite());
    ipcMain.on('open-repo-website', () => openRepoWebsite());
    ipcMain.on('open-issues-website', () => openIssuesWebsite());

    // Jogo.
    ipcMain.handle('current-world', () => cacheProxy.world);
    ipcMain.handle('current-world-config', () => ({ ...worldConfigProxy }));
    ipcMain.handle('current-world-units', () => ({ ...worldUnitProxy }));
    ipcMain.handle('is-archer-world', () => worldConfigProxy.archer);

    ipcMain.handle('player-name', (_e, alias: UserAlias): string | null => {
        if (!isUserAlias(alias)) return cacheProxy.player;
        return getPlayerNameFromAlias(alias);
    });

    // Informa ao painel que o navegador terminou de carregar.
    mainWindow.webContents.on('did-finish-load', () => {
        panelWindow.webContents.send('browser-did-finish-load');
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        panelWindow.webContents.send('browser-will-navigate');
        if (!isAllowedURL(url)) e.preventDefault();
    });

    mainWindow.webContents.on('did-navigate', () => insertCSS(mainWindow));

    // Outros eventos.
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
};