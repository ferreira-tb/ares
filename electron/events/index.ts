import * as fs from 'fs';
import { URL } from 'url';
import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setBrowserEvents } from '$electron/events/browser.js';
import { setErrorEvents } from '$electron/events/error.js';
import { setPanelEvents } from '$electron/events/panel.js';
import { setDeimosEvents } from '$electron/events/deimos.js';
import { MainProcessError } from '$electron/error.js';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers.js';
import { browserCss } from '$electron/utils/constants.js';
import { cacheStore } from '$interface/interface.js';

export function setEvents() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    // Informações gerais.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', () => cacheStore.userAlias);
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    // Informações do jogo.
    ipcMain.handle('current-world', () => cacheStore.world);

    // Informa ao painel qual é a URL atual sempre que ocorre navegação.
    // Além disso, insere o CSS e solicita ao browser que atualize o Deimos.
    const browserStyle = fs.readFileSync(browserCss, { encoding: 'utf8' });
    mainWindow.webContents.on('did-finish-load', async () => {
        try {
            panelWindow.webContents.send('browser-did-finish-load');
            await mainWindow.webContents.insertCSS(browserStyle);
        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        try {
            panelWindow.webContents.send('browser-will-navigate');

            const { origin } = new URL(url);
            if (/\.?tribalwars/.test(origin)) return;
            if (/\.?tb\.dev\.br/.test(origin)) return;
            e.preventDefault();
        } catch (err) {
            MainProcessError.catch(err);
        };
    });

    // Outros eventos.
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
};