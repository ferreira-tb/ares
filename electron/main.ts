import '@tb-dev/prototype';
import { app, BrowserWindow } from 'electron';
import { setAppMenu } from '$electron/menu/menu.js';
import { sequelize } from '$database/database.js';
import { UserConfig } from '$interface/index.js';
import { setEvents } from '$electron/events/index.js';
import { gameURL, favicon, indexHtml, browserJs } from '$electron/utils/constants.js';
import { MainProcessError } from '$electron/error.js';
import { isAllowedURL } from '$electron/utils/guards.js';
import { insertCSS, getWindowOpenHandler } from '$electron/utils/helpers.js';

process.env.ARES_MODE = 'dev';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
        title: 'Ares',
        icon: favicon,
        webPreferences: {
            spellcheck: false,
            preload: browserJs,
            devTools: process.env.ARES_MODE === 'dev'
        }
    });
    
    const panelWindow = new BrowserWindow({
        parent: mainWindow,
        width: 350,
        height: 250,
        show: false,
        resizable: false,
        fullscreenable: false,
        frame: false,
        titleBarStyle: 'hidden',
        webPreferences: {
            spellcheck: false,
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

    const windowOpenHandler = getWindowOpenHandler(true);
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (!isAllowedURL(url)) return { action: 'deny' };
        return windowOpenHandler;
    });

    mainWindow.webContents.on('did-create-window', (newWindow) => {
        newWindow.setMenu(null);
        newWindow.maximize();

        newWindow.webContents.on('will-navigate', (e, url) => {
            if (!isAllowedURL(url)) e.preventDefault();
        });

        newWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        newWindow.webContents.on('did-navigate', () => insertCSS(newWindow));
        newWindow.once('ready-to-show', () => newWindow.show());
    });
    
    mainWindow.loadURL(gameURL);
    panelWindow.loadFile(indexHtml);

    mainWindow.once('ready-to-show', () => mainWindow.show());
    panelWindow.once('ready-to-show', async () => {
        await UserConfig.setPanelBounds();
        panelWindow.show();
    });
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());

if (process.env.ARES_MODE === 'dev') {
    sequelize.sync({ alter: { drop: false } }).catch(MainProcessError.catch);
} else {
    sequelize.sync().catch(MainProcessError.catch);
};