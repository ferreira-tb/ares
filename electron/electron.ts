import '@tb-dev/prototype';
import { app, BrowserWindow, BrowserView } from 'electron';
import { storeToRefs } from 'mechanus';
import { setAppMenu } from '$electron/menu/menu';
import { sequelize } from '$electron/database';
import { setEvents } from '$electron/events/index';
import { appIcon, panelHtml, uiHtml, browserJs } from '$electron/utils/files';
import { setBrowserViewAutoResize } from '$electron/utils/view';
import { setEnv } from '$electron/env';
import { MainProcessError } from '$electron/error';
import { Dimensions } from '$common/constants';
import { isUserAlias } from '$common/guards';
import { getGameRegionUrl } from '$common/helpers';
import { appConfig } from '$electron/stores';
import { PlunderHistory, useBrowserViewStore, useCacheStore, usePlunderHistoryStore } from '$electron/interface';

setEnv();

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        minHeight: 100,
        show: false,
        title: `Ares ${app.getVersion()}`,
        icon: appIcon,
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
    process.env.PANEL_WINDOW_ID = panelWindow.id.toString(10);
    process.env.MAIN_VIEW_WEB_CONTENTS_ID = mainView.webContents.id.toString(10);

    const gameUrl = getGameRegionUrl(appConfig.get('general').lastRegion);
    Promise.all([
        mainWindow.loadFile(uiHtml),
        panelWindow.loadFile(panelHtml),
        mainView.webContents.loadURL(gameUrl)
    ]).catch(MainProcessError.catch);

    mainWindow.addBrowserView(mainView);
    mainWindow.setTopBrowserView(mainView);

    const { width, height } = mainWindow.getContentBounds();
    mainView.setBounds({ x: 0, y: Dimensions.TopContainerHeight, width, height: height - Dimensions.TopContainerHeight });

    const browserViewStore = useBrowserViewStore();
    const { currentAutoResize } = storeToRefs(browserViewStore);
    currentAutoResize.value = setBrowserViewAutoResize(mainView);

    setEvents();
    setAppMenu(browserViewStore, useCacheStore());

    // https://github.com/ferreira-tb/ares/issues/77
    mainWindow.on('system-context-menu', (e) => e.preventDefault());
    panelWindow.on('system-context-menu', (e) => e.preventDefault());

    mainWindow.once('ready-to-show', () => {
        const bounds = appConfig.get('ui').bounds;
        if (bounds) mainWindow.setBounds(bounds);

        mainWindow.show();
    });
    
    panelWindow.once('ready-to-show', () => {
        const bounds = appConfig.get('panel').bounds;
        if (bounds) panelWindow.setBounds(bounds);

        const shouldShowPanel = appConfig.get('panel').show;
        if (shouldShowPanel) panelWindow.show();

        panelWindow.webContents.send('panel:visibility-did-change', panelWindow.isVisible());
    });
};

app.on('window-all-closed', () => app.quit());
app.whenReady().then(() => createWindow())
    .catch(MainProcessError.catch);

app.once('will-quit', async (e) => {
    if (sequelize.isClosed) return;
    try {
        e.preventDefault();
        const cacheStore = useCacheStore();
        if (isUserAlias(cacheStore.userAlias)) {
            await PlunderHistory.saveHistory(cacheStore.userAlias, usePlunderHistoryStore());
        };
    } catch (err) {
        await MainProcessError.log(err);
    } finally {
        app.exit();
    };
});

// Inicializa o banco de dados.
(async () => {
    try {
        if (process.env.ARES_MODE === 'dev') {
            await sequelize.sync({ alter: { drop: false } });
        } else {
            await sequelize.sync();
        };
        
    } catch (err) {
        MainProcessError.catch(err);
    };
})();