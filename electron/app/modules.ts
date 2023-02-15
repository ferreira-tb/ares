import { BrowserWindow } from 'electron';
import { favicon, moduleHtml } from '$electron/utils/constants.js';
import { assertMainWindow, setBasicDevMenu } from '$electron/utils/helpers.js';

export function showErrorLog() {
    const mainWindow = assertMainWindow();

    const errorLogWindow = new BrowserWindow({
        parent: mainWindow,
        width: 500,
        height: 600,
        useContentSize: true,
        show: false,
        minimizable: false,
        maximizable: false,
        resizable: false,
        fullscreenable: false,
        title: 'Registro de erros',
        icon: favicon,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: process.env.ARES_MODE === 'dev'
        }
    });

    setBasicDevMenu(errorLogWindow, true);
    errorLogWindow.loadFile(moduleHtml);
    errorLogWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    errorLogWindow.once('ready-to-show', () =>  {
        errorLogWindow.webContents.send('set-module-route', 'error-log');
        errorLogWindow.show();
    });
};