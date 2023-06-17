import '@tb-dev/prototype';
import { app } from 'electron';
import { setMenu } from '$electron/menu';
import { sequelize } from '$electron/database';
import { setEvents } from '$electron/events';
import { setEnv } from '$electron/utils/env';
import { MainWindow, PanelWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { isUserAlias } from '$common/guards';
import { useCacheStore } from '$electron/stores';
import { PlunderHistory } from '$electron/database/models';
import { MainProcessError } from '$electron/error';
import { errorHandler } from '$electron/utils/error-handler';

setEnv();
MainProcessError.catch = errorHandler;

function createWindow() {
    MainWindow.create();
    PanelWindow.create();
    BrowserTab.create({ current: true });

    setEvents();
    setMenu();
};

app.whenReady().then(createWindow, MainProcessError.catch);

app.on('window-all-closed', () => app.quit());

app.once('will-quit', async (e) => {
    if (sequelize.isClosed) return;
    try {
        e.preventDefault();
        const cacheStore = useCacheStore();
        if (isUserAlias(cacheStore.userAlias)) {
            await PlunderHistory.saveHistory(cacheStore.userAlias);
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
        await MainProcessError.log(err);
    };
})();