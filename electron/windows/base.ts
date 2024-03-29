import { EventEmitter } from 'node:events';
import { BrowserWindow, webContents } from 'electron';
import { appConfig } from '$electron/stores';

export abstract class BaseWindow extends EventEmitter {
    public readonly browser;

    protected constructor(options?: BrowserWindowOptions) {
        super();

        this.browser = new BrowserWindow(options);
    }

    get addBrowserView() {
        return this.browser.addBrowserView.bind(this.browser);
    }

    get close() {
        return this.browser.close.bind(this.browser);
    }

    get focus() {
        return this.browser.focus.bind(this.browser);
    }

    get getContentBounds() {
        return this.browser.getContentBounds.bind(this.browser);
    }

    get hide() {
        return this.browser.hide.bind(this.browser);
    }

    get isDestroyed() {
        return this.browser.isDestroyed.bind(this.browser);
    }

    get inspectElement() {
        return this.browser.webContents.inspectElement.bind(this.browser.webContents);
    }

    get isFocused() {
        return this.browser.isFocused.bind(this.browser);
    }

    get isMaximized() {
        return this.browser.isMaximized.bind(this.browser);
    }

    get isMinimized() {
        return this.browser.isMinimized.bind(this.browser);
    }

    get isVisible() {
        return this.browser.isVisible.bind(this.browser);
    }

    get minimize() {
        return this.browser.minimize.bind(this.browser);
    }

    get reload() {
        return this.browser.webContents.reload.bind(this.browser.webContents);
    }

    get reloadIgnoringCache() {
        return this.browser.webContents.reloadIgnoringCache.bind(this.browser.webContents);
    }

    get removeBrowserView() {
        return this.browser.removeBrowserView.bind(this.browser);
    }

    get restore() {
        return this.browser.restore.bind(this.browser);
    }

    get setTopBrowserView() {
        return this.browser.setTopBrowserView.bind(this.browser);
    }

    get setMenu() {
        return this.browser.setMenu.bind(this.browser);
    }

    get show() {
        return this.browser.show.bind(this.browser);
    }

    get webContents() {
        return this.browser.webContents;
    }

    public openDevTools(options: Electron.OpenDevToolsOptions = { mode: 'detach' }) {
        const isEnabled = appConfig.get('advanced').devTools;
        if (isEnabled) this.browser.webContents.openDevTools(options);
    }

    /** Usado para situações de teste durante o desenvolvimento. */
    public static castDevMagic() {
        if (process.env.ARES_MODE !== 'development') return;
        const allWebContents = webContents.getAllWebContents();
        for (const contents of allWebContents) {
            contents.send('dev:magic');
        }
    }
}