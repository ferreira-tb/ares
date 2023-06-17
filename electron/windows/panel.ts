import { webContents } from 'electron';
import { BaseWindow } from '$electron/windows/base';
import { MainWindow } from '$electron/windows/main';
import { panelHtml } from '$electron/utils/files';
import { appConfig } from '$electron/stores';
import { MainProcessError } from '$electron/error';

export class PanelWindow extends BaseWindow {
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
        const mainWindow = MainWindow.getInstance();
        const options: Readonly<BrowserWindowOptions> = {
            parent: mainWindow.browser,
            width: 350,
            height: 250,
            show: false,
            resizable: false,
            fullscreenable: false,
            frame: false,
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

        this.browser.loadFile(panelHtml).catch(MainProcessError.catch);

        // https://github.com/ferreira-tb/ares/issues/77
        this.browser.on('system-context-menu', (e) => e.preventDefault());

        this.browser.on('moved', () => this.saveBounds());
        this.browser.on('resized', () => this.saveBounds());

        this.browser.once('ready-to-show', () => {
            const panelBounds = appConfig.get('panel').bounds;
            if (panelBounds) this.browser.setBounds(panelBounds);

            const shouldShowPanel = appConfig.get('panel').show;
            if (shouldShowPanel) this.browser.show();

            const isVisible = this.browser.isVisible();
            this.browser.webContents.send('panel:visibility-did-change', isVisible);
        });
    };

    private saveBounds() {
        const rectangle = this.browser.getBounds();
        appConfig.set('panel', { bounds: rectangle });
    };

    /** Alterna a visibilidade da janela do painel. */
    public toggle() {
        if (this.isVisible()) {
            this.hide();
            
            const mainWindow = MainWindow.getInstance();
            if (mainWindow.isVisible() && !mainWindow.isFocused()) {
                mainWindow.focus();
            };

        } else {
            this.show();
        };

        const isVisible = this.browser.isVisible();
        appConfig.set('panel', { show: isVisible });
        for (const content of webContents.getAllWebContents()) {
            content.send('panel:visibility-did-change', isVisible);
        };
    };
    
    private static panelWindow: PanelWindow | null = null;

    public static create() {
        if (this.panelWindow) return this.panelWindow;

        this.panelWindow = new PanelWindow();
        return this.panelWindow;
    };

    public static getInstance() {
        return this.panelWindow ?? this.create();
    };
};