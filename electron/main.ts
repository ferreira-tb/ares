import dotenv from 'dotenv';
import { app, BrowserWindow } from 'electron';
import { setAppMenu } from '$electron/menu.js';
import { setEvents } from '$electron/events/index.js';
import { gameURL, favicon, indexHtml, browserJs } from '$electron/constants.js';
import { getDeimosEndpoint } from '$electron/ares/deimos.js';

dotenv.config();

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
    
    const childWindow = new BrowserWindow({
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

    setEvents(mainWindow, childWindow);
    setAppMenu(mainWindow, childWindow);
    
    mainWindow.maximize();
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    
    mainWindow.loadURL(gameURL);
    childWindow.loadFile(indexHtml);

    mainWindow.once('ready-to-show', async () => {
        while (true) {
            try {
                const response = await fetch(getDeimosEndpoint());
                if (response.ok) return mainWindow.show();
            } catch {
                await new Promise((resolve) => setTimeout(resolve, 50));
            };
        };
    });
    
    childWindow.once('ready-to-show', () => childWindow.show());
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());
app.on('before-quit', async () => await fetch(`${getDeimosEndpoint()}/quit`));