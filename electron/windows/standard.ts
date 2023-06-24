/* eslint-disable @typescript-eslint/unified-signatures */
import { Menu } from 'electron';
import { BaseWindow } from '$electron/windows/base';
import { MainWindow } from '$electron/windows/main';
import { windowOptions } from '$electron/windows/options';
import { appIcon, windowsHtml } from '$electron/utils/files';
import { appConfig } from '$electron/stores';
import { StandardWindowError } from '$electron/error';
import type { StandardWindowName } from '$common/enum';

export class StandardWindow extends BaseWindow {
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    }

    public readonly name: StandardWindowName;

    private constructor(name: StandardWindowName, options: BrowserWindowOptions) {
        super(options);

        this.name = name;

        this.setStandardWindowMenu();
        this.browser.loadFile(windowsHtml).catch(StandardWindowError.catch);

        this.browser.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
        this.browser.webContents.setAudioMuted(true);

        const windowConfig = appConfig.get('window')[name];
        if (windowConfig) {
            const { bounds } = windowConfig;
            if (bounds) this.browser.setBounds(bounds);
        }

        this.browser.on('system-context-menu', (e) => e.preventDefault());

        this.browser.on('moved', () => this.saveBounds());
        this.browser.on('resized', () => this.saveBounds());
        
        this.browser.once('ready-to-show', () => {
            this.browser.webContents.send('window:set-route', this.name);
            this.show();
        });

        this.browser.once('close', () => {
            this.browser.removeAllListeners();
            StandardWindow.windows.delete(this.name);
        });
    }

    private saveBounds() {
        const rectangle = this.browser.getBounds();
        appConfig.set(`window.${this.name}`, { bounds: rectangle });
    }

    private setStandardWindowMenu() {
        const options: Electron.MenuItemConstructorOptions[] = [
            { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => this.reloadIgnoringCache() },
            { label: 'Iniciar teste', accelerator: 'CmdOrCtrl+F9', click: () => BaseWindow.dev() },
            { label: 'Inspecionar', accelerator: 'CmdOrCtrl+F12', click: () => this.openDevTools() }
        ];
    
        options.forEach((option) => {
            option.visible = false;
        });
    
        const menu = Menu.buildFromTemplate(options);
        this.setMenu(menu);
    }

    /** Janelas ativas. */
    private static readonly windows = new Map<StandardWindowName, StandardWindow>();

    public static getWindow(name: StandardWindowName): StandardWindow | null;
    public static getWindow(contents: Electron.WebContents): StandardWindow | null;
    public static getWindow(nameOrContents: Electron.WebContents | StandardWindowName): StandardWindow | null {
        if (typeof nameOrContents === 'string') {
            return this.windows.get(nameOrContents) ?? null;
        }

        for (const standardWindow of this.windows.values()) {
            if (standardWindow.webContents === nameOrContents) return standardWindow;
        }

        return null;
    }

    public static open<T extends keyof BrowserWindowOptions>(name: StandardWindowName): StandardWindow | null {
        try {
            const previous = this.windows.get(name);
            if (previous instanceof StandardWindow && !previous.isDestroyed()) {
                if (previous.isVisible()) previous.focus();
                if (previous.isMinimized()) previous.restore();
                return previous;
            }

            const mainWindow = MainWindow.getInstance();
            const options: BrowserWindowOptions = {
                parent: mainWindow.browser,
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
                    nodeIntegrationInWorker: true,
                    contextIsolation: false
                }
            };

            for (const [key, value] of Object.entries(windowOptions[name]) as [T, BrowserWindowOptions[T]][]) {
                options[key] = value;
            }

            const standardWindow = new StandardWindow(name, options);
            StandardWindow.windows.set(name, standardWindow);
            return standardWindow;

        } catch (err) {
            StandardWindowError.catch(err);
            return null;
        }
    }
}