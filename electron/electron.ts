import '@tb-dev/prototype';
import { app, BrowserWindow, BrowserView } from 'electron';
import { setAppMenu } from '$electron/menu/menu';
import { sequelize } from '$database/database';
import { UserConfig } from '$interface/index';
import { setEvents } from '$electron/events/index';
import { gameURL, favicon, panelHtml, mainHtml, browserJs } from '$electron/utils/constants';
import { MainProcessError } from '$electron/error';
import { isAllowedURL } from '$electron/utils/guards';
import { insertCSS, getWindowOpenHandler } from '$electron/utils/helpers';

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
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.ARES_MODE === 'dev'
        }
    });

    const mainView = new BrowserView({
        webPreferences: {
            spellcheck: false,
            preload: browserJs,
            nodeIntegration: false,
            contextIsolation: true,
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
    process.env.MAIN_VIEW_WEB_CONTENTS_ID = mainView.webContents.id.toString(10);
    process.env.PANEL_WINDOW_ID = panelWindow.id.toString(10);

    setEvents();
    setAppMenu();
    
    mainWindow.maximize();

    const windowOpenHandler = getWindowOpenHandler(true);
    mainView.webContents.setWindowOpenHandler(({ url }) => {
        if (!isAllowedURL(url)) return { action: 'deny' };
        return windowOpenHandler;
    });

    mainView.webContents.on('did-create-window', (newWindow) => {
        newWindow.setMenu(null);
        newWindow.maximize();

        newWindow.webContents.on('will-navigate', (e, url) => {
            if (!isAllowedURL(url)) e.preventDefault();
        });

        newWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        newWindow.webContents.on('did-navigate', () => insertCSS(newWindow.webContents));
        newWindow.once('ready-to-show', () => newWindow.show());
    });
    
    mainWindow.loadFile(mainHtml);
    panelWindow.loadFile(panelHtml);

    mainView.setAutoResize({ width: true, height: true, horizontal: true, vertical: true });
    mainView.setBounds(mainWindow.getBounds());
    mainWindow.addBrowserView(mainView);
    mainView.webContents.loadURL(gameURL);

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