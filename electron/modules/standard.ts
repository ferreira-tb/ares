import { BrowserWindow } from 'electron';
import { appIcon, moduleHtml } from '$electron/utils/files';
import { getMainWindow } from '$electron/utils/helpers';
import { ModuleCreationError } from '$electron/error';
import { setModuleDevMenu } from '$electron/menu/dev';
import { appConfig } from '$electron/stores';

const activeModules = new Map<ModuleNames, BrowserWindow>();
export const getActiveModule = (name: ModuleNames) => activeModules.get(name) ?? null;
export function getActiveModuleWebContents(name: ModuleNames) {
    const moduleWindow = getActiveModule(name);
    return moduleWindow?.webContents ?? null;
};

export function createModule<T extends keyof ModuleConstructorOptions>(
    moduleName: ModuleNames,
    defaultRoute: ModuleRoutes,
    options: ModuleConstructorOptions = {}
) {
    return function(route?: ModuleRoutes): void {
        try {
            const mainWindow = getMainWindow();

            // Se a janela já estiver aberta, foca-a.
            const previousWindow = getActiveModule(moduleName);
            if (previousWindow instanceof BrowserWindow && !previousWindow.isDestroyed()) {
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
            moduleWindow.webContents.setAudioMuted(true);
            moduleWindow.on('system-context-menu', (e) => e.preventDefault());

            const moduleBounds = appConfig.get('moduleBounds')[moduleName];
            if (moduleBounds) {
                const { bounds } = moduleBounds;
                if (bounds) moduleWindow.setBounds(bounds);
            };

            moduleWindow.on('moved', saveBounds(moduleWindow, moduleName));
            moduleWindow.on('resized', saveBounds(moduleWindow, moduleName));
            
            moduleWindow.once('ready-to-show', () => {
                activeModules.set(moduleName, moduleWindow);
                moduleWindow.webContents.send('module:set-route', route ?? defaultRoute);
                moduleWindow.show();
            });

            moduleWindow.once('closed', () => {
                moduleWindow.removeAllListeners();
                activeModules.delete(moduleName);
            });

        } catch (err) {
            ModuleCreationError.catch(err);
        };
    };
};

function saveBounds(moduleWindow: Electron.CrossProcessExports.BrowserWindow, moduleName: ModuleNames) {
    return function() {
        const rectangle = moduleWindow.getBounds();
        appConfig.set('moduleBounds', {
            [moduleName]: { bounds: rectangle }
        } satisfies ModuleBoundsConfigType);
    };
};