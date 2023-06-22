import { URL } from 'node:url';
import { readFileSync } from 'fs';
import { EventEmitter } from 'node:events';
import { BrowserView, Menu } from 'electron';
import { ref, wheneverAsync } from 'mechanus';
import { MainWindow } from '$electron/windows';
import { browserCss, browserJs } from '$electron/utils/files';
import { appConfig } from '$electron/stores';
import { BrowserTabError } from '$electron/error';
import { Dimensions, GameUrl } from '$common/enum';
import { isAllowedOrigin } from '$common/guards';
import { getGameRegionUrl } from '$common/utils';

export class BrowserTab extends EventEmitter {
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    };

    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    };

    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    };

    public readonly id: number;
    public readonly view: BrowserView;

    private constructor(id: number) {
        super();

        const webPreferences: Electron.WebPreferences = {
            spellcheck: false,
            nodeIntegration: false,
            contextIsolation: true
        };

        if (!BrowserTab.mainTab.value) webPreferences.preload = browserJs;
        this.view = new BrowserView({ webPreferences });

        this.id = id;
        this.setWindowOpenHandler();

        const mainWindow = MainWindow.getInstance();

        this.view.webContents.on('will-navigate', (e, url) => {
            if (!isAllowedOrigin(url)) e.preventDefault();
        });

        this.view.webContents.on('did-navigate', async () => {
            try {
                await this.view.webContents.insertCSS(BrowserTab.css);
                
                if (BrowserTab.currentTab.value !== this) return;
                this.updateBackForwardStatus();
            } catch (err) {
                BrowserTabError.catch(err);
            };
        });
    
        this.view.webContents.on('did-navigate-in-page', () => {
            if (BrowserTab.currentTab.value !== this) return;
            this.updateBackForwardStatus();
        });
    
        this.view.webContents.on('did-frame-navigate', () => {
            if (BrowserTab.currentTab.value !== this) return;
            this.updateBackForwardStatus();
        });
    
        this.view.webContents.on('did-redirect-navigation', () => {
            if (BrowserTab.currentTab.value !== this) return;
            this.updateBackForwardStatus();
        });

        this.view.webContents.on('page-title-updated', () => {
            // O título da aba principal não deve ser alterado.
            if (BrowserTab.mainTab.value === this) return;

            const title = this.getTitle() || this.getURL();
            mainWindow.webContents.send('tab:did-update-title', this.id, title);
        });

        this.view.webContents.on('page-favicon-updated', (_e, favicons) => {
            // O ícone da aba principal não deve ser alterado.
            if (BrowserTab.mainTab.value === this) return;

            const favicon = favicons[0];
            mainWindow.webContents.send('tab:did-update-favicon', this.id, favicon);
        });

        this.view.webContents.on('did-start-loading', () => this.updateLoadingStatus());
        this.view.webContents.on('did-stop-loading', () => this.updateLoadingStatus());
    };

    get canGoBack() {
        return this.view.webContents.canGoBack.bind(this.view.webContents);
    };

    get canGoForward() {
        return this.view.webContents.canGoForward.bind(this.view.webContents);
    };

    get getTitle() {
        return this.view.webContents.getTitle.bind(this.view.webContents);
    };

    get getURL() {
        return this.view.webContents.getURL.bind(this.view.webContents);
    };

    get inspectElement() {
        return this.view.webContents.inspectElement.bind(this.view.webContents);
    };

    get insertCSS() {
        return this.view.webContents.insertCSS.bind(this.view.webContents);
    };

    get isLoading() {
        return this.view.webContents.isLoading.bind(this.view.webContents);
    };

    get loadURL() {
        return this.view.webContents.loadURL.bind(this.view.webContents);
    };

    get reload() {
        return this.view.webContents.reload.bind(this.view.webContents);
    };

    get reloadIgnoringCache() {
        return this.view.webContents.reloadIgnoringCache.bind(this.view.webContents);
    };

    get webContents() {
        return this.view.webContents;
    };

    public destroy() {
        // A aba principal não pode ser destruída.
        if (BrowserTab.mainTab.value === this) return;
        
        const mainWindow = MainWindow.getInstance();
        queueMicrotask(() => {
            this.view.webContents.removeAllListeners();
            BrowserTab.tabs.delete(this.id);
            mainWindow.removeBrowserView(this.view);
        });
        
        // Notifica a janela principal que a aba foi destruída.
        mainWindow.webContents.send('tab:destroyed', this.id);
    };

    public goBack() {
        if (this.view.webContents.canGoBack()) {
            this.view.webContents.goBack();
        };
    };
    
    public goForward() {
        if (this.view.webContents.canGoForward()) {
            this.view.webContents.goForward();
        };
    };

    public goHome() {
        let url: GameUrl;
        const region = appConfig.get('general').lastRegion;
        switch (region) {
            case 'br':
                url = GameUrl.Brazil;
                break;
            case 'en':
                url = GameUrl.Global;
                break;
            case 'nl':
                url = GameUrl.Netherlands;
                break;
            case 'pt':
                url = GameUrl.Portugal;
                break;
            case 'uk':
                url = GameUrl.UnitedKingdom;
                break;
            case 'us':
                url = GameUrl.UnitedStates;
                break;
            default:
                url = GameUrl.Brazil;
        };
    
        this.view.webContents.loadURL(url).catch(BrowserTabError.catch);
    };

    public openDevTools(options: Electron.OpenDevToolsOptions = { mode: 'detach' }) {
        const isEnabled = appConfig.get('advanced').devTools;
        if (isEnabled) this.view.webContents.openDevTools(options);
    };

    private setTabBounds() {
        const mainWindow = MainWindow.getInstance();
        const { width, height } = mainWindow.getContentBounds();
        this.view.setBounds({
            x: 0,
            y: Dimensions.TopContainerHeight,
            width,
            height: height - Dimensions.TopContainerHeight
        });
    };

    /** Determina o comportamento da aplicação quando uma nova janela for requisita peloo WebContents da aba. */
    private setWindowOpenHandler() {
        this.view.webContents.setWindowOpenHandler(({ url }) => {
            queueMicrotask(() => BrowserTab.create({ url }));
            return { action: 'deny' };
        });
    };

    private updateBackForwardStatus() {
        const status: BackForwardStatus = {
            canGoBack: this.view.webContents.canGoBack(),
            canGoForward: this.view.webContents.canGoForward()
        };

        const mainWindow = MainWindow.getInstance();
        mainWindow.webContents.send('tab:back-forward-status', status);
    };

    private updateLoadingStatus() {
        const mainWindow = MainWindow.getInstance();
        mainWindow.webContents.send('tab:loading-status', this.id, this.isLoading());
    };

    /** O id aumenta a cada nova aba criada. */
    private static id: number = 0;
    /** Função que remove o evento de redimensionamento da aba. */
    private static removeAutoResize: (() => void) | null = null;

    private static readonly currentTab = ref<BrowserTab | null>(null);
    private static readonly mainTab = ref<BrowserTab | null>(null);
    private static readonly tabs = new Map<number, BrowserTab>();

    /** CSS padrão das abas. */
    private static readonly css = readFileSync(browserCss, { encoding: 'utf8' });

    static {
        wheneverAsync(this.currentTab, async (current, previous: BrowserTab | null) => {
            previous?.view.setBounds({ x: 0, y: 0, width: 0, height: 0 });

            this.removeAutoResize?.();
            this.setAutoResize(current);

            await current.insertCSS(this.css);
            const mainWindow = MainWindow.getInstance();
            mainWindow.setTopBrowserView(current.view);
            current.setTabBounds();
            current.updateBackForwardStatus();
        });
    };

    static get current(): BrowserTab {
        const tab = this.currentTab.value ?? this.mainTab.value;
        if (!tab) throw new BrowserTabError('No tab is currently open.');
        return tab;
    };

    static get main(): BrowserTab {
        if (!this.mainTab.value) throw new BrowserTabError('Main tab is not open.');
        return this.mainTab.value;
    };

    public static create(options: CreateBrowserTabOptions = {}) {
        try {
            if (!options.url) options.url = this.getDefaultURL();
            if (!isAllowedOrigin(options.url)) return null;

            const tabId = this.id++;
            const tab = new BrowserTab(tabId);
            this.tabs.set(tabId, tab);

            const mainWindow = MainWindow.getInstance();
            mainWindow.addBrowserView(tab.view);

            if (options.current || this.currentTab.value === null) {
                this.currentTab.value = tab;
            };

            tab.loadURL(options.url).catch(BrowserTabError.catch);

            if (this.mainTab.value) {
                // Envia o id e o título da aba para a janela principal.
                // Isso é necessário para que ela possa renderizar a nova aba.
                const title = tab.getTitle() || tab.getURL();
                mainWindow.webContents.send('tab:created', tabId, title);
            } else {
                this.mainTab.value = tab;
            };

            return tab;

        } catch (err) {
            BrowserTabError.catch(err);
            return null;
        };
    };

    /**
     * Cria uma URL com base na URL do `webContents` da aba principal.
     * @param search String que será adicionada à query da URL.
     */
    public static createURL(search?: string): URL {
        if (!this.mainTab.value) throw new BrowserTabError('Main tab is not open.');
        const url = new URL(this.mainTab.value.webContents.getURL());
        if (typeof search === 'string') url.search = search;
        return url;
    };

    public static destroy(tabId: number) {
        const tab = this.tabs.get(tabId);
        if (!tab) throw new BrowserTabError(`Tab ${tabId} does not exist.`);
        tab.destroy();
    };

    public static destroyAll(exclude: number | number[] = []) {
        const excludeArray = Array.isArray(exclude) ? exclude : [exclude];
        const tabs = [...this.tabs.values()].filter((tab) => {
            if (tab.id === this.mainTab.value?.id) return false;
            if (excludeArray.includes(tab.id)) return false;
            return true;
        });

        tabs.forEach((tab) => tab.destroy());
    };

    private static getDefaultURL(): GameUrl {
        const lastRegion = appConfig.get('general').lastRegion;
        return getGameRegionUrl(lastRegion);
    };

    public static getTab(tabId: number): BrowserTab | null {
        const tab = this.tabs.get(tabId);
        return tab ?? null;
    };

    /**
     * Define o evento de redimensionamento automático da aba atual.
     * @returns Função para remover o evento.
     */
    private static setAutoResize(browserTab: BrowserTab): void {
        
        let timeout: NodeJS.Immediate | null = null;
        function resize(e: Electron.IpcMainEvent) {
            e.preventDefault();
            timeout = setImmediate(() => {
                if (timeout) clearImmediate(timeout);
                browserTab.setTabBounds();
            });
        };

        const mainWindow = MainWindow.getInstance();
        mainWindow.browser.on('resize', resize);
        this.removeAutoResize = () => {
            mainWindow.browser.removeListener('resize', resize);
            this.removeAutoResize = null;
        };
    };

    public static setCurrent(tabId: number) {
        const tab = this.tabs.get(tabId);
        if (!tab) throw new BrowserTabError(`Tab with ID ${tabId} does not exist.`);
        this.currentTab.value = tab;
    };

    public static showContextMenu(tabId: number) {
        const tab = this.tabs.get(tabId);
        if (!tab) throw new BrowserTabError(`Tab with ID ${tabId} does not exist.`);

        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Duplicar', click: () => this.create({ url: tab.getURL() }) },
            { type: 'separator' },
            { label: 'Fechar', click: () => tab.destroy() },
            { label: 'Fechar outras', click: () => this.destroyAll(tab.id) }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    };
};