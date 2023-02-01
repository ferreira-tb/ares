import { BrowserWindow } from "electron";
import { favicon, moduleHtml } from "./constants";
import { setBasicDevMenu } from "./helpers";
import { getDeimosPort } from "./deimos.js";

export function showErrorLog(mainWindow: BrowserWindow) {
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
            contextIsolation: false
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

export function showSwaggerUI() {
    const swaggerUI = new BrowserWindow({
        width: 1200,
        height: 1000,
        useContentSize: true,
        show: false,
        fullscreenable: false,
        title: 'Ares',
        icon: favicon,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    setBasicDevMenu(swaggerUI, true);

    swaggerUI.loadURL(`http://127.0.0.1:${getDeimosPort()}/deimos/doc`);
    swaggerUI.once('ready-to-show', () =>  swaggerUI.show());
};