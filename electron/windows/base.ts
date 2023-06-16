import { EventEmitter } from 'node:events';
import { BrowserWindow } from 'electron';

export abstract class BaseWindow extends EventEmitter {
    public readonly browser;

    protected constructor(options?: BrowserWindowOptions) {
        super();

        this.browser = new BrowserWindow(options);
    };

    get addBrowserView() {
        return this.browser.addBrowserView.bind(this.browser);
    };

    get close() {
        return this.browser.close.bind(this.browser);
    };

    get focus() {
        return this.browser.focus.bind(this.browser);
    };

    get getContentBounds() {
        return this.browser.getContentBounds.bind(this.browser);
    };

    get hide() {
        return this.browser.hide.bind(this.browser);
    };

    get isDestroyed() {
        return this.browser.isDestroyed.bind(this.browser);
    };

    get isFocused() {
        return this.browser.isFocused.bind(this.browser);
    };

    get isMaximized() {
        return this.browser.isMaximized.bind(this.browser);
    };

    get isMinimized() {
        return this.browser.isMinimized.bind(this.browser);
    };

    get isVisible() {
        return this.browser.isVisible.bind(this.browser);
    };

    get minimize() {
        return this.browser.minimize.bind(this.browser);
    };

    get removeBrowserView() {
        return this.browser.removeBrowserView.bind(this.browser);
    };

    get setTopBrowserView() {
        return this.browser.setTopBrowserView.bind(this.browser);
    };

    get setMenu() {
        return this.browser.setMenu.bind(this.browser);
    };

    get show() {
        return this.browser.show.bind(this.browser);
    };

    get webContents() {
        return this.browser.webContents;
    };

    public openDevTools(options?: Electron.OpenDevToolsOptions) {
        options ??= { mode: 'detach' };
        this.browser.webContents.openDevTools(options);
    };
};