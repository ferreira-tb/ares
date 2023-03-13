import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { isInstanceOf } from '@tb-dev/ts-guard';
import { aresURL, favicon, moduleHtml, repoURL, issuesURL } from '$electron/utils/constants';
import { getMainWindow } from '$electron/utils/helpers';
import { setBasicDevMenu } from '$electron/menu/dev';
import { isAllowedURL } from '$electron/utils/guards';
import { ModuleCreationError } from '$electron/error';
import type { ModuleNames, ModuleRoutes, ModuleConstructorOptions, WebsiteModuleNames } from '$types/modules';

const activeModules = new Map<ModuleNames, BrowserWindow>();
const activeWebsiteModules = new Map<WebsiteModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name);
export const getActiveWebsiteModule = (name: WebsiteModuleNames) => activeWebsiteModules.get(name);

function createModule(name: ModuleNames, defaultRoute: ModuleRoutes, options: ModuleConstructorOptions = {}) {
    return function(route?: ModuleRoutes) {
        try {
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
                    spellcheck: false,
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

        } catch (err) {
            ModuleCreationError.catch(err);
        };
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

export const showDemolitionConfig = createModule('demolition', 'demolition', {
    width: 1000,
    height: 600,
    title: 'Demolição',
    minimizable: true
});

export const showCustomPlunderTemplate = createModule('custom-plunder-template', 'custom-plunder-template', {
    width: 1000,
    height: 600,
    title: 'Modelos',
    minimizable: true
});

function createWebsiteModule(name: WebsiteModuleNames, url: string) {
    return function() {
        try {
            // Se a janela já estiver aberta, foca-a.
            const previousWindow = activeWebsiteModules.get(name);
            if (isInstanceOf(previousWindow, BrowserWindow) && !previousWindow.isDestroyed()) {
                if (!previousWindow.isVisible()) {
                    previousWindow.show();
                } else {
                    previousWindow.focus();
                };
                return;
            };

            const websiteWindow = new BrowserWindow({
                parent: getMainWindow(),
                width: 1200,
                height: 800,
                useContentSize: true,
                show: false,
                minimizable: true,
                maximizable: true,
                resizable: true,
                fullscreenable: false,
                title: 'Ares',
                icon: favicon,
                autoHideMenuBar: true,
                webPreferences: {
                    spellcheck: false,
                    devTools: process.env.ARES_MODE === 'dev'
                }
            });

            websiteWindow.setMenu(null);
            websiteWindow.loadURL(url);
            websiteWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

            websiteWindow.once('ready-to-show', () =>  {
                activeWebsiteModules.set(name, websiteWindow);
                websiteWindow.show();
            });

            websiteWindow.webContents.on('will-navigate', (e, url) => {
                if (!isAllowedURL(url)) e.preventDefault();
            });

            websiteWindow.once('close', () => activeWebsiteModules.delete(name));

        } catch (err) {
            ModuleCreationError.catch(err);
        };
    };
};

export const openAresWebsite = createWebsiteModule('ares', aresURL);
export const openRepoWebsite = createWebsiteModule('repo', repoURL);
export const openIssuesWebsite = createWebsiteModule('issues', issuesURL);