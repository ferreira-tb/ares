import * as fs from 'fs';
import { URL } from 'url';
import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setBrowserEvents } from '$electron/events/browser.js';
import { setErrorEvents } from '$electron/events/error.js';
import { setPanelEvents } from '$electron/events/panel.js';
import { setDeimosEvents } from '$electron/events/deimos.js';
import { MainProcessError } from '$electron/error.js';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import { browserCss } from '$electron/utils/constants.js';
import { getUserAlias } from '$interface/interface.js';

export function setEvents() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    // Informações sobre o Ares.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-alias', async () => await getUserAlias());
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('user-desktop-path', () => app.getPath('desktop'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    // Informa ao painel qual é a URL atual sempre que ocorre navegação.
    // Além disso, insere o CSS e solicita ao browser que atualize o Deimos.
    const browserStyle = fs.readFileSync(browserCss, { encoding: 'utf8' });
    mainWindow.webContents.on('did-finish-load', async () => {

        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        panelWindow.webContents.send('page-url', currentURL);

        try {
            await mainWindow.webContents.insertCSS(browserStyle);
        } catch (err) {
            MainProcessError.capture(err);
        };
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        try {
            const { origin } = new URL(url);
            if (/\.?tribalwars/.test(origin)) return;
            if (/\.?tb\.dev\.br/.test(origin)) return;
            e.preventDefault();
        } catch (err) {
            MainProcessError.capture(err);
        };
    });

    // Outros eventos.
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
};