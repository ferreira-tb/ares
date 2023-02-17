import { BrowserWindow } from 'electron';
import { favicon, moduleHtml } from '$electron/utils/constants.js';
import { assertMainWindow } from '$electron/utils/helpers.js';
import { setBasicDevMenu } from '$electron/menu/dev.js';
import type { ModuleNames } from '$types/electron.js';

const activeModules = new Map<ModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name);

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
        activeModules.set('error-log', errorLogWindow);
        errorLogWindow.webContents.send('set-module-route', 'error-log');
        errorLogWindow.show();
    });

    // Remove do mapa quando a janela for fechada.
    errorLogWindow.once('closed', () => activeModules.delete('error-log'));
};