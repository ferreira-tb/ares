import { app } from 'electron';
import { BaseWindow } from '$electron/windows/base';
import { appIcon, uiHtml } from '$electron/utils/files';
import { appConfig } from '$electron/stores';
import { MainProcessError } from '$electron/error';

export class MainWindow extends BaseWindow {
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    };

    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    };

    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    };

    private constructor() {
        const options: Readonly<BrowserWindowOptions> = {
            width: 1200,
            height: 1000,
            minHeight: 100,
            show: false,
            title: `Ares ${app.getVersion()}`,
            icon: appIcon,
            frame: false,
            resizable: true,
            movable: true,
            minimizable: true,
            maximizable: true,
            fullscreenable: false,
            closable: true,
            titleBarStyle: 'hidden',
            darkTheme: true,
            webPreferences: {
                spellcheck: false,
                nodeIntegration: true,
                contextIsolation: false,
                devTools: process.env.ARES_MODE === 'dev'
            }
        };

        super(options);

        this.browser.loadFile(uiHtml).catch(MainProcessError.catch);

        const bounds = appConfig.get('ui').bounds;
        if (bounds) this.browser.setBounds(bounds);
        this.browser.maximize();

        // https://github.com/ferreira-tb/ares/issues/77
        this.browser.on('system-context-menu', (e) => e.preventDefault());

        this.browser.on('moved', () => this.saveBounds());
        this.browser.on('resized', () => this.saveBounds());
        
        this.browser.once('ready-to-show', () => this.browser.show());
    };

    /**
     * Maximiza ou restaura a janela, dependendo do estado atual.
     * @returns Boolean indicando se a janela está maximizada.
     */
    public maximizeOrRestore(): boolean {
        if (this.browser.isMaximized()) {
            this.browser.restore();
        } else {
            this.browser.maximize();
        };

        return this.browser.isMaximized();
    };

    private saveBounds() {
        const rectangle = this.browser.getBounds();
        appConfig.set('ui', { bounds: rectangle });
    };

    private static mainWindow: MainWindow | null = null;

    public static create() {
        if (this.mainWindow) return this.mainWindow;

        this.mainWindow = new MainWindow();
        return this.mainWindow;
    };

    public static getInstance() {
        return this.mainWindow ?? this.create();
    };
};