import { BrowserWindow, type BrowserWindowConstructorOptions } from 'electron';
import { isInstanceOf, isString } from '$global/guards';
import { WebsiteUrl } from '$global/constants';
import { appIcon, moduleHtml } from '$electron/utils/files';
import { getMainWindow } from '$electron/utils/helpers';
import { isAllowedOrigin } from '$global/guards';
import { ModuleCreationError } from '$electron/error';
import { setModuleDevMenu } from '$electron/menu/dev';
import type { ModuleNames, ModuleRoutes, ModuleConstructorOptions, WebsiteModuleNames } from '$types/modules';

const activeModules = new Map<ModuleNames, BrowserWindow>();
const activeWebsiteModules = new Map<WebsiteModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name) ?? null;
export const getActiveWebsiteModule = (name: WebsiteModuleNames) => activeWebsiteModules.get(name) ?? null;

export function getActiveModuleWebContents(name: ModuleNames) {
    const moduleWindow = getActiveModule(name);
    return moduleWindow?.webContents ?? null;
};

function createModule<T extends keyof ModuleConstructorOptions>(
    name: ModuleNames,
    defaultRoute: ModuleRoutes,
    options: ModuleConstructorOptions = {}
) {
    return function(route?: ModuleRoutes): void {
        try {
            const mainWindow = getMainWindow();

            // Se a janela já estiver aberta, foca-a.
            const previousWindow = getActiveModule(name);
            if (isInstanceOf(previousWindow, BrowserWindow) && !previousWindow.isDestroyed()) {
                if (previousWindow.isVisible()) {
                    previousWindow.focus();   
                } else {
                    previousWindow.show();
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
                icon: appIcon,
                autoHideMenuBar: true,
                webPreferences: {
                    spellcheck: false,
                    nodeIntegration: true,
                    contextIsolation: false,
                    devTools: process.env.ARES_MODE === 'dev'
                }
            };

            for (const [key, value] of Object.entries(options) as [T, ModuleConstructorOptions[T]][]) {
                windowOptions[key] = value;
            };

            const moduleWindow = new BrowserWindow(windowOptions);
            setModuleDevMenu(moduleWindow);
            moduleWindow.loadFile(moduleHtml).catch(ModuleCreationError.catch);
            moduleWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
            moduleWindow.on('system-context-menu', (e) => e.preventDefault());

            moduleWindow.once('ready-to-show', () => {
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

export const showAppSettings = createModule('app-config', 'app-config', {
    width: 500,
    height: 600,
    title: 'Configurações'
});

export const showAppUpdate = createModule('app-update', 'app-update', {
    width: 350,
    height: 260,
    title: 'Atualização'
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

export const showCustomPlunderTemplate = createModule('plunder-template', 'plunder-template', {
    width: 1000,
    height: 600,
    title: 'Modelos',
    minimizable: true
});

function createWebsiteModule(name: WebsiteModuleNames, url: string) {
    return function(arbitraryUrl?: string) {
        try {
            if (name === 'any-allowed') {
                if (!isString(arbitraryUrl) || !isAllowedOrigin(arbitraryUrl)) {
                    throw new ModuleCreationError('When module name is "any-allowed", arbitraryUrl must be a string.');
                } else {
                    url = arbitraryUrl;
                };

            } else if (isString(arbitraryUrl)) {
                throw new ModuleCreationError('Cannot pass arbitraryUrl when module name is not "any".');
            };

            // Se a janela já estiver aberta, foca-a.
            const previousWindow = activeWebsiteModules.get(name);
            if (isInstanceOf(previousWindow, BrowserWindow) && !previousWindow.isDestroyed()) {
                if (previousWindow.isVisible()) {
                    previousWindow.focus();  
                } else {
                    previousWindow.show();
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
                icon: appIcon,
                autoHideMenuBar: true,
                webPreferences: {
                    spellcheck: false,
                    devTools: process.env.ARES_MODE === 'dev'
                }
            });

            setModuleDevMenu(websiteWindow);
            websiteWindow.loadURL(url).catch(ModuleCreationError.catch);
            websiteWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
            websiteWindow.on('system-context-menu', (e) => e.preventDefault());

            websiteWindow.once('ready-to-show', () => {
                activeWebsiteModules.set(name, websiteWindow);
                websiteWindow.show();
            });

            websiteWindow.webContents.on('will-navigate', (e, targetUrl) => {
                if (!isAllowedOrigin(targetUrl)) e.preventDefault();
            });

            websiteWindow.once('close', () => activeWebsiteModules.delete(name));

        } catch (err) {
            ModuleCreationError.catch(err);
        };
    };
};

export const openAnyAllowedWebsite = createWebsiteModule('any-allowed', '');
export const openAresWebsite = createWebsiteModule('ares', WebsiteUrl.Ares);
export const openRepoWebsite = createWebsiteModule('repo', WebsiteUrl.Repository);
export const openIssuesWebsite = createWebsiteModule('issues', WebsiteUrl.Issues);