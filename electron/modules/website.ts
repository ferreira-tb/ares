import { BrowserWindow } from 'electron';
import { isInstanceOf, isString } from '$shared/guards';
import { appIcon } from '$electron/utils/files';
import { getMainWindow } from '$electron/utils/helpers';
import { isAllowedOrigin } from '$shared/guards';
import { ModuleCreationError } from '$electron/error';
import { setModuleDevMenu } from '$electron/menu/dev';

const activeWebsiteModules = new Map<WebsiteModuleNames, BrowserWindow>();
export const getActiveWebsiteModule = (name: WebsiteModuleNames) => activeWebsiteModules.get(name) ?? null;

export function createWebsiteModule(name: WebsiteModuleNames, url: string) {
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