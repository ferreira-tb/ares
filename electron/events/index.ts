import * as fs from 'fs/promises';
import { app, ipcMain, type BrowserWindow } from 'electron';
import { setPlunderEvents } from '$electron/events/plunder.js';
import { setGameEvents } from '$electron/events/game.js';
import { setErrorEvents } from '$electron/events/error.js';
import { MainProcessError } from '$electron/error.js';
import { styleCss } from '$electron/constants.js';

export function setEvents(mainWindow: BrowserWindow, panelWindow: BrowserWindow) {
    // Informações sobre o Ares.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());
    ipcMain.handle('user-data-path', () => app.getPath('userData'));
    ipcMain.handle('is-dev', () => process.env.ARES_MODE === 'dev');

    ipcMain.on('reload-main-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-main-window', () => mainWindow.webContents.reloadIgnoringCache());

    // Informa às janelas qual é a URL atual sempre que ocorre navegação.
    mainWindow.webContents.on('did-finish-load', async () => {
        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        panelWindow.webContents.send('page-url', currentURL);

        try {
            const style = await fs.readFile(styleCss, { encoding: 'utf8' });
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
    setGameEvents(mainWindow, panelWindow);
    setPlunderEvents(mainWindow, panelWindow);
    setErrorEvents();
};