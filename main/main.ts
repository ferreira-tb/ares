import * as path from 'path';
import { app, BrowserWindow } from 'electron';
import { mainMenu, childMenu } from './menu.js';
import './config.js';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Claustrophobia',
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, '../public/favicon.ico'),
        webPreferences: {
            preload: path.resolve(__dirname, 'preload.js')
        }
    });
    
    const childWindow = new BrowserWindow({
        parent: mainWindow,
        width: 300,
        height: 200,
        show: false,
        closable: false,
        minimizable: false,
        maximizable: false,
        title: 'Claustrophobia',
        autoHideMenuBar: true,
        icon: path.resolve(__dirname, '../public/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Eventos.
    mainWindow.webContents.on('did-finish-load', () => {
        const currentURL = mainWindow.webContents.getURL();
        childWindow.webContents.send('game-url', currentURL);
    });

    // Outros.
    mainWindow.maximize();

    mainWindow.setMenu(mainMenu);
    childWindow.setMenu(childMenu);

    mainWindow.loadURL('https://www.tribalwars.com.br/');
    childWindow.loadFile('dist/index.html');

    mainWindow.once('ready-to-show', () => mainWindow.show());
    childWindow.once('ready-to-show', () => childWindow.show());
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());