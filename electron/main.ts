import '@tb-dev/prototype';
import { app, BrowserWindow } from 'electron';
import { setAppMenu } from '$electron/menu/menu.js';
import { sequelize } from '$electron/database/database.js';
import { UserConfig } from '$tables/index.js';
import { setEvents } from '$electron/events/index.js';
import { gameURL, favicon, indexHtml, browserJs } from '$electron/utils/constants.js';
import { MainProcessError } from '$electron/error.js';
import { saveStoreState } from '$electron/stores/index.js';

process.env.ARES_MODE = 'dev';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Ares',
        icon: favicon,
        webPreferences: {
            preload: browserJs,
            devTools: process.env.ARES_MODE === 'dev'
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
            contextIsolation: false,
            devTools: process.env.ARES_MODE === 'dev'
        }
    });

    process.env.MAIN_WINDOW_ID = mainWindow.id.toString(10);
    process.env.PANEL_WINDOW_ID = panelWindow.id.toString(10);

    setEvents();
    setAppMenu();
    
    mainWindow.maximize();
    mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    
    mainWindow.loadURL(gameURL);
    panelWindow.loadFile(indexHtml);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    panelWindow.once('ready-to-show', async () => {
        await UserConfig.setPanelBounds();
        panelWindow.show();
    });
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', async () => {
    await saveStoreState();
    app.quit();
});

sequelize.sync().catch(MainProcessError.capture);