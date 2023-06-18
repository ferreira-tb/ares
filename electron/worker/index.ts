/* eslint-disable @typescript-eslint/unified-signatures */
import * as path from 'node:path';
import { EventEmitter } from 'node:events';
import { BrowserView, MessageChannelMain } from 'electron';
import { computed, ref, until, watchImmediate, wheneverAsync } from 'mechanus';
import { MainWindow } from '$electron/windows';
import { TribalWorkerError } from '$electron/error';
import type { UntilOptions, WatchStopHandle } from 'mechanus';
import type { TribalWorkerName } from '$common/constants';

export class TribalWorker extends EventEmitter {
    public override emit(event: 'destroyed'): boolean;
    public override emit(event: 'ready', webContents: Electron.WebContents): boolean;
    public override emit(event: 'port:message', message: unknown): boolean;
    public override emit(event: string, ...args: any[]): boolean {
        return super.emit(event, ...args);
    };

    public override on(event: 'destroyed', listener: () => void): this;
    public override on(event: 'ready', listener: (webContents: Electron.WebContents) => void): this;
    public override on(event: 'port:message', listener: (message: unknown) => void): this;
    public override on(event: string, listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    };

    public override once(event: 'destroyed', listener: () => void): this;
    public override once(event: 'ready', listener: (webContents: Electron.WebContents) => void): this;
    public override once(event: 'port:message', listener: (message: unknown) => void): this;
    public override once(event: string, listener: (...args: any[]) => void): this {
        return super.once(event, listener);
    };

    /** Nome do Worker. */
    public readonly name: TribalWorkerName;
    /** URL que será carregada no Worker. */
    public readonly url: import('node:url').URL;
    /** Caminho do arquivo que contém o Worker. */
    public readonly path: string;
    
    private readonly browserView = ref<BrowserView | null>(null);
    private readonly isDestroyed = ref(false);
    private readonly isLoading = ref(false);
    private readonly messagePort = ref<Electron.MessagePortMain | null>(null);
    private readonly watchers: Set<WatchStopHandle>;

    /** Indica se o webContents do Worker está pronto para uso. */
    public readonly isReady = computed(
        [this.browserView, this.isDestroyed, this.isLoading, this.messagePort],
    () => {
        if (!this.browserView.value) return false;
        if (!this.messagePort.value) return false;
        if (this.isDestroyed.value) return false;
        if (this.isLoading.value) return false;
        return true;
    });
    
    constructor(name: TribalWorkerName, url: import('node:url').URL) {
        super();

        this.name = name;
        this.path = path.join(__dirname, `worker/tribal/${name}.js`);
        this.url = url;

        const readyWatcher = wheneverAsync(this.isReady, () => {
            this.emit('ready', this.webContents);
        });

        this.watchers = new Set([
            readyWatcher,
            this.setBrowserViewWatcher()
        ]);
    };

    get destroyed(): boolean {
        return this.isDestroyed.value;
    };

    /** Porta do MessageChannel usado pelo Worker. */
    get port(): Electron.MessagePortMain {
        if (!this.messagePort.value) {
            throw new TribalWorkerError(`There is no message port for TribalWorker "${this.name}".`);
        };
        return this.messagePort.value;
    };

    /** WebContents do Worker. */
    get webContents(): Electron.WebContents {
        if (!(this.browserView.value instanceof BrowserView)) {
            throw new TribalWorkerError(`TribalWorker "${this.name}" is not initialized.`);
        };

        return this.browserView.value.webContents;
    };

    /**
     * Destroi a instância do Worker, removendo-a da janela mãe.
     * @returns Retorna um booleano indicando se a instância foi destruída.
     */
    public destroy(): boolean {
        try {
            if (this.isDestroyed.value) return true;

            if (this.messagePort.value) {
                this.messagePort.value.removeAllListeners().close();
                this.messagePort.value = null;
            };

            if (this.browserView.value) {
                const mainWindow = MainWindow.getInstance();
                this.browserView.value.webContents.removeAllListeners();
                mainWindow.removeBrowserView(this.browserView.value);
            };

            this.watchers.forEach((stop) => stop());
            this.watchers.clear();

            this.browserView.value = null;
            this.isDestroyed.value = true;

            this.emit('destroyed');
            return true;

        } catch (err) {
            TribalWorkerError.catch(err);
            return false;
        };
    };

    /**
     * Inicializa uma instância do Worker, anexando-a à janela mãe.
     * Se já houver uma instância ativa usando o nome escolhido, ela será destruída.
     */
    public async init(): Promise<void> {
        if (this.isDestroyed.value) {
            throw new TribalWorkerError(`TribalWorker "${this.name}" is destroyed.`);
        };

        const aliveWorker = TribalWorker.getWorker(this.name);
        if (aliveWorker instanceof TribalWorker) {
            aliveWorker.destroy();
        };

        const tribalWorker = new BrowserView({
            webPreferences: {
                spellcheck: false,
                preload: this.path,
                nodeIntegration: false,
                contextIsolation: true,
                devTools: process.env.ARES_MODE === 'dev'
            }
        });

        const mainWindow = MainWindow.getInstance();
        mainWindow.addBrowserView(tribalWorker);

        tribalWorker.setBounds({ x: 0, y: 0, width: 0, height: 0 });
        tribalWorker.setAutoResize({ width: false, height: false, horizontal: false, vertical: false });
        tribalWorker.webContents.setAudioMuted(true);

        this.browserView.value = tribalWorker;
        await tribalWorker.webContents.loadURL(this.url.href);

        TribalWorker.setWorker(this.name, this);
        this.setupMessageChannel();
    };

    public openDevTools() {
        this.webContents.openDevTools({ mode: 'detach' });
    };

    private setBrowserViewWatcher(): () => void {
        return watchImmediate(this.browserView, (view) => {
            if (!(view instanceof BrowserView)) return;
            const contents = view.webContents;
            contents.on('did-start-loading', () => (this.isLoading.value = contents.isLoading()));
            contents.on('did-stop-loading', () => (this.isLoading.value = contents.isLoading()));
            contents.on('did-finish-load', () => (this.isLoading.value = contents.isLoading()));
            contents.on('did-fail-load', () => (this.isLoading.value = contents.isLoading()));
            contents.on('did-fail-provisional-load', () => (this.isLoading.value = contents.isLoading()));
            contents.on('dom-ready', () => (this.isLoading.value = contents.isLoading()));
        });
    };

    private setupMessageChannel(): void {
        const { port1, port2 } = new MessageChannelMain();
        
        this.messagePort.value = port1;
        port1.on('message', (e: Electron.MessageEvent) => {
            this.emit('port:message', e.data);
        });

        this.webContents.postMessage('port', null, [port2]);
        port1.start();
    };

    /** Permite aguardar até que o webContents do Worker esteja carregado. */
    public whenReady(
        timeout: UntilOptions['timeout'] = 10000,
        throwOnTimeout: UntilOptions['throwOnTimeout'] = true,
        timeoutReason: UntilOptions['timeoutReason'] = `Worker "${this.name}" took too long to load.`
    ): Promise<void> {
        this.isLoading.value = this.webContents.isLoading();
        return until(this.isReady).toBe(true, { timeout, throwOnTimeout, timeoutReason });
    };

    /** Instâncias ativas do Worker. */
    private static readonly active = new Map<TribalWorkerName, TribalWorker>();

    /**
     * Se o Worker já estiver destruído, apenas o remove da lista de instâncias ativas, se lá estiver.
     * @param tribalWorker Instância do Worker ou nome do Worker que será destruído.
     * @returns Retorna um booleano indicando se o Worker foi destruído.
     */
    public static destroyWorker(tribalWorker: TribalWorker | TribalWorkerName): boolean {
        if (tribalWorker instanceof TribalWorker) {
            tribalWorker.destroy();
        } else {
            const worker = this.getWorker(tribalWorker);
            if (worker instanceof TribalWorker) {
                return worker.destroy();
            };
        };

        return false;
    };

    public static getWorker(name: TribalWorkerName): TribalWorker | null;
    public static getWorker(contents: Electron.WebContents): TribalWorker | null;
    public static getWorker(nameOrContents: Electron.WebContents | TribalWorkerName): TribalWorker | null {
        if (typeof nameOrContents === 'string') {
            return this.active.get(nameOrContents) ?? null;
        };

        for (const worker of this.active.values()) {
            if (worker.webContents === nameOrContents) return worker;
        };

        return null;
    };

    /**
     * Guarda a instância do Worker na lista de instâncias ativas.
     * 
     * Além disso, adiciona um listener para removê-lo da lista quando for destruído.
     */
    private static setWorker(name: TribalWorkerName, worker: TribalWorker): void {
        worker.once('destroyed', () => this.active.delete(name));
        this.active.set(name, worker);
    };
};