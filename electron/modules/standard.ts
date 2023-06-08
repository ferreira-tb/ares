import { BrowserWindow } from 'electron';
import { isInstanceOf } from '$common/guards';
import { appIcon, moduleHtml } from '$electron/utils/files';
import { getMainWindow } from '$electron/utils/helpers';
import { ModuleCreationError } from '$electron/error';
import { setModuleDevMenu } from '$electron/menu/dev';

const activeModules = new Map<ModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name) ?? null;
export function getActiveModuleWebContents(name: ModuleNames) {
    const moduleWindow = getActiveModule(name);
    return moduleWindow?.webContents ?? null;
};

export function createModule<T extends keyof ModuleConstructorOptions>(
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

            const windowOptions: Electron.BrowserWindowConstructorOptions = {
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