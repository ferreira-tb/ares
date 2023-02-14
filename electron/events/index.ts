import * as fs from 'fs/promises';
import { app, ipcMain, BrowserWindow } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setBrowserEvents } from '$electron/events/browser.js';
import { setErrorEvents } from '$electron/events/error.js';
import { setPanelEvents } from '$electron/events/panel.js';
import { setDeimosEvents } from '$electron/events/deimos.js';
import { MainProcessError } from '$electron/error.js';
import { assertType } from '$electron/utils/assert.js';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers.js';
import { browserCss } from '$electron/utils/constants.js';

export function setEvents() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    assertType(mainWindow instanceof BrowserWindow, 'Não foi possível obter a janela do browser.');
    assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');

    // Informações sobre o Ares.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    // Informa às janelas qual é a URL atual sempre que ocorre navegação.
    mainWindow.webContents.on('did-finish-load', async () => {
        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        panelWindow.webContents.send('page-url', currentURL);

        try {
            const style = await fs.readFile(browserCss, { encoding: 'utf8' });
            await mainWindow.webContents.insertCSS(style);
        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (!url.includes('tribalwars')) e.preventDefault();
    });

    // Outros eventos.
    setBrowserEvents();
    setPanelEvents();
    setPlunderEvents();
    setErrorEvents();
    setDeimosEvents();
};