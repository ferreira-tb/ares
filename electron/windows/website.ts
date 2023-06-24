import { Menu } from 'electron';
import { BaseWindow } from '$electron/windows/base';
import { MainWindow } from '$electron/windows/main';
import { appIcon } from '$electron/utils/files';
import { WebsiteWindowError } from '$electron/error';
import { isAllowedOrigin } from '$common/guards';

export class WebsiteWindow extends BaseWindow {
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    }

    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }

    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    }

    private constructor(url: string, options: BrowserWindowOptions) {
        super(options);

        this.setWebsiteWindowMenu();
        this.browser.loadURL(url).catch(WebsiteWindowError.catch);

        this.browser.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

        this.browser.on('system-context-menu', (e) => e.preventDefault());
        this.browser.once('ready-to-show', () => this.show());

        this.browser.webContents.on('will-navigate', (e, targetUrl) => {
            if (!isAllowedOrigin(targetUrl)) e.preventDefault();
        });
    }

    public setWebsiteWindowMenu() {
        const options: Electron.MenuItemConstructorOptions[] = [
            { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => this.reloadIgnoringCache() },
            { label: 'Conjurar magia', accelerator: 'CmdOrCtrl+F9', click: () => BaseWindow.castDevMagic() },
            { label: 'Inspecionar', accelerator: 'CmdOrCtrl+F12', click: () => this.openDevTools() }
        ];
    
        options.forEach((option) => {
            option.visible = false;
        });
    
        const menu = Menu.buildFromTemplate(options);
        this.setMenu(menu);
    }

    public static open(url: string): WebsiteWindow | null {
        try {
            if (!isAllowedOrigin(url)) return null;

            const mainWindow = MainWindow.getInstance();
            const options: BrowserWindowOptions = {
                parent: mainWindow.browser,
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
                    nodeIntegration: false,
                    contextIsolation: true
                }
            };

            return new WebsiteWindow(url, options);

        } catch (err) {
            WebsiteWindowError.catch(err);
            return null;
        }
    }
}