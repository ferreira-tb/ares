import { app, BrowserWindow } from 'electron';
import * as path from 'path';
import { mainMenu } from './menu.js';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        title: 'Claustrophobia',
        icon: path.resolve(__dirname, '../public/favicon.ico')
    });
    
    const childWindow = new BrowserWindow({
        parent: mainWindow,
        width: 200,
        height: 300,
        closable: false,
        resizable: false,
        minimizable: false,
        maximizable: false,
        title: 'Claustrophobia',
        icon: path.resolve(__dirname, '../public/favicon.ico'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenu(mainMenu);
    childWindow.setMenu(null);

    mainWindow.loadURL('https://www.tribalwars.com.br/');
    childWindow.loadFile('dist/index.html');
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());