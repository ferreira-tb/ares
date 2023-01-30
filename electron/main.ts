import dotenv from 'dotenv';
import http from 'node:http';
import { app, BrowserWindow, ipcMain } from 'electron';
import { setAppMenu } from './menu.js';
import { setEvents } from './events/index.js';
import { gameURL, favicon, indexHtml, gameJs } from './constants.js';
import { getDeimosPort } from './helpers.js';

dotenv.config();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Ares',
        icon: favicon,
        webPreferences: {
            preload: gameJs
        }
    });
    
    const childWindow = new BrowserWindow({
        parent: mainWindow,
        width: 300,
        minWidth: 300,
        maxWidth: 500,
        height: 200,
        minHeight: 200,
        maxHeight: 500,
        useContentSize: true,
        show: false,
        closable: false,
        minimizable: false,
        maximizable: false,
        fullscreenable: false,
        title: 'Ares',
        autoHideMenuBar: true,
        icon: favicon,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    setEvents(mainWindow, childWindow);
    setAppMenu(mainWindow, childWindow);
    
    mainWindow.maximize();
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    
    mainWindow.loadURL(gameURL);
    childWindow.loadFile(indexHtml);

    mainWindow.once('ready-to-show', () =>  mainWindow.show());
    childWindow.once('ready-to-show', () => childWindow.show());
};

ipcMain.handle('deimos-port', () => getDeimosPort());

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());
app.on('before-quit', () => http.get(`http://127.0.0.1:${getDeimosPort(true)}/deimos/quit`));