import dotenv from 'dotenv';
import getPort from 'get-port';
import http from 'node:http';
import { app, BrowserWindow } from 'electron';
import { execFile } from 'child_process';
import { setAppMenu } from '#/menu.js';
import { setEvents } from '#/events/index.js';
import { aresExe, gameURL, favicon, indexHtml, preloadJs } from '#/constants.js';
import { MainProcessError } from '#/error.js';

dotenv.config();

let pyPort = '8000';
getPort({ port: 8000 }).then((port) => {
    pyPort = port.toString(10);
    const args = [pyPort, app.getPath('userData')];
    execFile(aresExe, args, (err) => MainProcessError.handle(err));

    if (process.env.ARES_MODE === 'dev') console.log('Porta:', pyPort);
});

/** Título padrão do aplicativo. */
const appTitle = `${app.getName()} ${app.getVersion()}`;

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: appTitle,
        icon: favicon,
        webPreferences: {
            preload: preloadJs
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
        minimizable: true,
        maximizable: false,
        title: appTitle,
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

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => http.get(`http://127.0.0.1:${pyPort}/ares/quit`));