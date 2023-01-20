import { app, ipcMain } from 'electron';
import { setPlunderEvents } from '#/events/plunder.js';
import { setGameEvents } from '#/events/game.js';
import type { BrowserWindow } from 'electron';

export function setEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    // Informações sobre o Claustrophobia.
    ipcMain.handle('app-name', () => app.getName());
    ipcMain.handle('app-version', () => app.getVersion());

    // Informa às janelas qual é a URL atual sempre que ocorre navegação.
    mainWindow.webContents.on('did-finish-load', () => {
        const currentURL = mainWindow.webContents.getURL();
        mainWindow.webContents.send('page-url', currentURL);
        childWindow.webContents.send('page-url', currentURL);
    });

    // Impede que o usuário navegue para fora da página do jogo.
    mainWindow.webContents.on('will-navigate', (e, url) => {
        if (!url.includes('tribalwars')) e.preventDefault();
    });

    // Outros eventos.
    setGameEvents(mainWindow, childWindow);
    setPlunderEvents(mainWindow);
};