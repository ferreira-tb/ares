import '@tb-dev/prototype';
import { app, BrowserWindow, BrowserView } from 'electron';
import { storeToRefs } from 'mechanus';
import { setAppMenu } from '$electron/menu/menu';
import { sequelize } from '$database/database';
import { setEvents } from '$electron/events/index';
import { gameURL, favicon, panelHtml, mainHtml, browserJs } from '$electron/utils/constants';
import { setBrowserViewAutoResize } from '$electron/utils/view';
import { MainProcessError } from '$electron/error';
import { AppConfig, useBrowserViewStore, useAppGeneralConfigStore } from '$interface/index';

process.env.ARES_MODE = 'dev';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        minHeight: 100,
        show: false,
        title: `Ares ${app.getVersion()}`,
        icon: favicon,
        frame: false,
        resizable: true,
        movable: true,
        minimizable: true,
        maximizable: true,
        fullscreenable: false,
        closable: true,
        titleBarStyle: 'hidden',
        darkTheme: true,
        webPreferences: {
            spellcheck: false,
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.ARES_MODE === 'dev'
        }
    });

    /** A BrowserView principal jamais deve ser destruída. */
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
        darkTheme: true,
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

    mainView.webContents.loadURL(gameURL);
    mainWindow.loadFile(mainHtml);
    panelWindow.loadFile(panelHtml);

    mainWindow.maximize();
    mainWindow.addBrowserView(mainView);
    mainWindow.setTopBrowserView(mainView);

    const { width, height } = mainWindow.getContentBounds();
    mainView.setBounds({ x: 0, y: 80, width, height: height - 80 });

    const browserViewStore = useBrowserViewStore();
    const { currentAutoResize } = storeToRefs(browserViewStore);
    currentAutoResize.value = setBrowserViewAutoResize(mainView);

    setEvents();
    setAppMenu(browserViewStore);

    // https://github.com/ferreira-tb/ares/issues/77
    mainWindow.on('system-context-menu', (e) => e.preventDefault());
    panelWindow.on('system-context-menu', (e) => e.preventDefault());

    mainWindow.once('ready-to-show', () => mainWindow.show());
    panelWindow.once('ready-to-show', async () => {
        await AppConfig.setPanelBounds();
        panelWindow.show();
        panelWindow.webContents.send('panel-visibility-did-change', panelWindow.isVisible());
    });
};

app.whenReady().then(() => createWindow());
app.on('window-all-closed', () => app.quit());

// Inicializa o banco de dados.
(async () => {
    try {
        if (process.env.ARES_MODE === 'dev') {
            sequelize.sync({ alter: { drop: false } });
        } else {
            sequelize.sync();
        };

        const generalConfigStore = useAppGeneralConfigStore();
        await AppConfig.setGeneralConfig(generalConfigStore);
        
    } catch (err) {
        MainProcessError.catch(err);
    };
})();