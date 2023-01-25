import { app, ipcMain } from 'electron';
import * as fs from 'node:fs/promises';
import { setPlunderEvents } from '#/events/plunder.js';
import { setGameEvents } from '#/events/game.js';
import { setDevEvents } from '#/events/dev.js';
import { MainProcessError } from '#/error.js';
import type { BrowserWindow } from 'electron';

export function setEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    // Informações sobre o Ares.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());

    ipcMain.on('reload-main-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-main-window', () => mainWindow.webContents.reloadIgnoringCache());

    // Informa às janelas qual é a URL atual sempre que ocorre navegação.
    mainWindow.webContents.on('did-finish-load', async () => {
        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        childWindow.webContents.send('page-url', currentURL);

        try {
            const style = await fs.readFile('__dist__/style.css', { encoding: 'utf8' });
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
    setGameEvents(mainWindow, childWindow);
    setPlunderEvents(mainWindow, childWindow);

    if (process.env.CLAUSTROPHOBIC_MODE === 'dev') setDevEvents();
};