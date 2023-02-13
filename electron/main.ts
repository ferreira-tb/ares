import { app, BrowserWindow } from 'electron';
import { setAppMenu } from '$electron/menu.js';
import { sequelize } from '$electron/database/database.js';
import { setEvents } from '$electron/events/index.js';
import { gameURL, favicon, indexHtml, browserJs } from '$electron/constants.js';

process.env.ARES_MODE = 'dev';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Ares',
        icon: favicon,
        webPreferences: {
            preload: browserJs
        }
    });
    
    const panelWindow = new BrowserWindow({
        parent: mainWindow,
        width: 300,
        minWidth: 300,
        maxWidth: 500,
        height: 200,
        minHeight: 200,
        maxHeight: 500,
        show: false,
        fullscreenable: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    setEvents(mainWindow, panelWindow);
    setAppMenu(mainWindow, panelWindow);
    
    mainWindow.maximize();
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    
    mainWindow.loadURL(gameURL);
    panelWindow.loadFile(indexHtml);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    panelWindow.once('ready-to-show', () => panelWindow.show());
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());

sequelize.sync().catch((err: unknown) => console.error(err));