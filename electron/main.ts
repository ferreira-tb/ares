import dotenv from 'dotenv';
import getPort from 'get-port';
import http from 'node:http';
import { app, BrowserWindow } from 'electron';
import { resolve } from 'path';
import { spawn } from 'child_process';
import { setAppMenu } from '#/menu.js';
import { setEvents } from '#/events/index.js';

dotenv.config();

let pyPort = '8000';
const pyPath = resolve(__dirname, '../__testpy__/phobia.exe');
getPort({ port: 8000 }).then((port) => {
    pyPort = port.toString(10);
    spawn(pyPath, [pyPort]);
});

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Claustrophobia',
        autoHideMenuBar: true,
        icon: resolve(__dirname, '../public/favicon.ico'),
        webPreferences: {
            preload: resolve(__dirname, 'preload.js')
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
        title: 'Claustrophobia',
        autoHideMenuBar: true,
        icon: resolve(__dirname, '../public/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    setEvents(mainWindow, childWindow);
    setAppMenu(mainWindow, childWindow);
    
    mainWindow.maximize();
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    mainWindow.loadURL('https://www.tribalwars.com.br/');
    childWindow.loadFile('__dist__/index.html');

    mainWindow.once('ready-to-show', () =>  mainWindow.show());
    childWindow.once('ready-to-show', () => childWindow.show());
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());
app.on('will-quit', () => http.get(`http://127.0.0.1:${pyPort}/quit`));