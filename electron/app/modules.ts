import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { isInstanceOf } from '@tb-dev/ts-guard';
import { favicon, moduleHtml } from '$electron/utils/constants.js';
import { getMainWindow } from '$electron/utils/helpers.js';
import { setBasicDevMenu } from '$electron/menu/dev.js';
import type { ModuleNames, ModuleRoutes, ModuleConstructorOptions } from '$types/modules.js';

const activeModules = new Map<ModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name);

function createModule(name: ModuleNames, defaultRoute: ModuleRoutes, options: ModuleConstructorOptions = {}) {
    return function(route?: ModuleRoutes) {
        const mainWindow = getMainWindow();

        // Se a janela já estiver aberta, foca-a.
        const previousWindow = getActiveModule(name);
        if (isInstanceOf(previousWindow, BrowserWindow) && !previousWindow.isDestroyed()) {
            if (!previousWindow.isVisible()) {
                previousWindow.show();
            } else {
                previousWindow.focus();
            };
            return;
        };

        const windowOptions: BrowserWindowConstructorOptions = {
            parent: mainWindow,
            width: 500,
            height: 600,
            useContentSize: true,
            show: false,
            minimizable: false,
            maximizable: false,
            resizable: false,
            fullscreenable: false,
            title: 'Ares',
            icon: favicon,
            autoHideMenuBar: true,
            webPreferences: {
                nodeIntegration: true,
                contextIsolation: false,
                devTools: process.env.ARES_MODE === 'dev'
            }
        };

        for (const [key, value] of Object.entries(options) as [keyof ModuleConstructorOptions, any][]) {
            Reflect.set(windowOptions, key, value);
        };

        const moduleWindow = new BrowserWindow(windowOptions);

        setBasicDevMenu(moduleWindow, true);
        moduleWindow.loadFile(moduleHtml);
        moduleWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

        moduleWindow.once('ready-to-show', () =>  {
            activeModules.set(name, moduleWindow);
            moduleWindow.webContents.send('set-module-route', route ?? defaultRoute);
            moduleWindow.show();
        });

        // Remove do mapa quando a janela for fechada.
        moduleWindow.once('closed', () => activeModules.delete(name));
    };
};

export const showAppConfig = createModule('app-config', 'app-config', {
    width: 500,
    height: 600,
    title: 'Configurações'
});

export const showErrorLog = createModule('error-log', 'error-log', {
    width: 500,
    height: 600,
    title: 'Registro de Erros'
});