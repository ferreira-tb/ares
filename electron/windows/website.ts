import { BaseWindow } from '$electron/windows/base';
import { MainWindow } from '$electron/windows/main';
import { appIcon } from '$electron/utils/files';
import { setWindowDevMenu } from '$electron/menu';
import { WebsiteWindowError } from '$electron/error';
import { isAllowedOrigin } from '$common/guards';

export class WebsiteWindow extends BaseWindow {
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    };

    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    };

    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    };

    private constructor(url: string, options: BrowserWindowOptions) {
        super(options);

        setWindowDevMenu(this);
        this.browser.loadURL(url).catch(WebsiteWindowError.catch);

        this.browser.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

        this.browser.on('system-context-menu', (e) => e.preventDefault());
        this.browser.once('ready-to-show', () => this.show());

        this.browser.webContents.on('will-navigate', (e, targetUrl) => {
            if (!isAllowedOrigin(targetUrl)) e.preventDefault();
        });
    };

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
                    contextIsolation: true,
                    devTools: process.env.ARES_MODE === 'dev'
                }
            };

            return new WebsiteWindow(url, options);

        } catch (err) {
            WebsiteWindowError.catch(err);
            return null;
        };
    };
};