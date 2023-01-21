import { app, ipcMain } from 'electron';
// import { readFile } from 'node:fs/promises';
import { setPlunderEvents } from '#/events/plunder.js';
import { setGameEvents } from '#/events/game.js';
// import { MainProcessError } from '#/error.js';
import type { BrowserWindow } from 'electron';

export function setEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    // Informações sobre o Claustrophobia.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());

    // Informa às janelas qual é a URL atual sempre que ocorre navegação.
    mainWindow.webContents.on('did-finish-load', async () => {
        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        childWindow.webContents.send('page-url', currentURL);

        /*
        try {
            const style = await readFile('dist/style.css', { encoding: 'utf8' });
            await mainWindow.webContents.insertCSS(style);
        } catch (err) {
            MainProcessError.handle(err);
        };*/
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (!url.includes('tribalwars')) e.preventDefault();
    });

    // Outros eventos.
    setGameEvents(mainWindow, childWindow);
    setPlunderEvents(mainWindow, childWindow);
};