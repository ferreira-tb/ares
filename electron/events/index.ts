import * as fs from 'fs';
import { URL } from 'url';
import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setBrowserEvents } from '$electron/events/browser.js';
import { setErrorEvents } from '$electron/events/error.js';
import { setPanelEvents } from '$electron/events/panel.js';
import { setDeimosEvents } from '$electron/events/deimos.js';
import { setModuleEvents } from '$electron/events/modules.js';
import { MainProcessEventError } from '$electron/error.js';
import { getMainWindow, getPanelWindow, openAresWebsite } from '$electron/utils/helpers.js';
import { browserCss } from '$electron/utils/constants.js';
import { cacheProxy, worldConfigProxy, worldUnitProxy } from '$interface/index.js';

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
    ipcMain.on('open-ares-website', () => openAresWebsite());

    // Jogo.
    ipcMain.handle('current-world', () => cacheProxy.world);
    ipcMain.handle('current-world-config', () => ({ ...worldConfigProxy }));
    ipcMain.handle('current-world-units', () => ({ ...worldUnitProxy }));
    ipcMain.handle('is-archer-world', () => worldConfigProxy.archer);

    // Informa ao painel qual é a URL atual sempre que ocorre navegação.
    // Além disso, insere o CSS e solicita ao browser que atualize o Deimos.
    const browserStyle = fs.readFileSync(browserCss, { encoding: 'utf8' });
    mainWindow.webContents.on('did-finish-load', async () => {
        try {
            panelWindow.webContents.send('browser-did-finish-load');
            await mainWindow.webContents.insertCSS(browserStyle);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        try {
            panelWindow.webContents.send('browser-will-navigate');

            const { origin } = new URL(url);
            if (/\.?tribalwars/.test(origin)) return;
            if (/\.?tb\.dev\.br\/ares/.test(origin)) return;
            e.preventDefault();
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Outros eventos.
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
    setModuleEvents();
};