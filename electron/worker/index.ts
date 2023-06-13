import * as path from 'node:path';
import { EventEmitter } from 'node:events';
import { BrowserView, MessageChannelMain } from 'electron';
import { computed, ref, until, watchImmediate, type UntilOptions } from 'mechanus';
import { getMainWindow } from '$electron/utils/helpers';
import { TribalWorkerError } from '$electron/error';
import { getMainViewWebContents } from '$electron/utils/view';
import type { TribalWorkerName } from '$common/constants';

export class TribalWorker extends EventEmitter {
    /** Nome do Worker. */
    public readonly name: TribalWorkerName;
    /** URL que será carregada no Worker. */
    public readonly url: import('node:url').URL;
    /** Caminho do arquivo que contém o Worker. */
    public readonly path: string;
    
    readonly #browserView = ref<BrowserView | null>(null);
    readonly #isDestroyed = ref(false);
    readonly #isLoading = ref(false);
    readonly #messagePort = ref<Electron.MessagePortMain | null>(null);
    readonly #watchers = new Set<() => void>();

    /** Indica se o webContents do Worker está pronto. */
    public readonly isReady = computed(
        [this.#browserView, this.#isDestroyed, this.#isLoading, this.#messagePort],
    () => {
        if (!this.#browserView.value) return false;
        if (!this.#messagePort.value) return false;
        if (this.#isDestroyed.value) return false;
        if (this.#isLoading.value) return false;
        return true;
    });
    
    constructor(name: TribalWorkerName, url: import('node:url').URL) {
        super();

        this.name = name;
        this.path = path.join(__dirname, `worker/${name}.js`);
        this.url = url;

        this.#watchers.add(this.#setBrowserViewWatcher());
    };

    get isDestroyed(): boolean {
        return this.#isDestroyed.value;
    };

    /** Porta do MessageChannel usado pelo Worker. */
    get port(): Electron.MessagePortMain {
        if (!this.#messagePort.value) {
            throw new TribalWorkerError(`There is no message port for TribalWorker "${this.name}".`);
        };
        return this.#messagePort.value;
    };

    /** WebContents do Worker. */
    get webContents(): Electron.WebContents {
        if (!(this.#browserView.value instanceof BrowserView)) {
            throw new TribalWorkerError(`TribalWorker "${this.name}" is not initialized.`);
        };

        return this.#browserView.value.webContents;
    };

    #createMessageChannel(): void {
        const { port1, port2 } = new MessageChannelMain();
        this.webContents.postMessage('port', null, [port2]);
        port1.postMessage({ channel: this.name });
        this.#messagePort.value = port1;
    };

    #setBrowserViewWatcher(): () => void {
        return watchImmediate(this.#browserView, (view) => {
            if (!(view instanceof BrowserView)) return;
            const contents = view.webContents;
            contents.on('did-start-loading', () => (this.#isLoading.value = contents.isLoading()));
            contents.on('did-stop-loading', () => (this.#isLoading.value = contents.isLoading()));
            contents.on('did-finish-load', () => (this.#isLoading.value = contents.isLoading()));
            contents.on('did-fail-load', () => (this.#isLoading.value = contents.isLoading()));
            contents.on('did-fail-provisional-load', () => (this.#isLoading.value = contents.isLoading()));
            contents.on('dom-ready', () => (this.#isLoading.value = contents.isLoading()));
        });
    };

    /** Destroi a instância do Worker, removendo-a da janela mãe. */
    public destroy(): void {
        try {
            if (this.#isDestroyed.value) return;

            if (this.#messagePort.value) {
                this.#messagePort.value.removeAllListeners().close();
                this.#messagePort.value = null;
            };

            if (this.#browserView.value) {
                this.#browserView.value.webContents.removeAllListeners();

                const mainWindow = getMainWindow();
                mainWindow.removeBrowserView(this.#browserView.value);
            };

            this.#watchers.forEach((stop) => stop());
            this.#watchers.clear();
            
            TribalWorker.deleteWorker(this.name);

            this.#browserView.value = null;
            this.#isDestroyed.value = true;

            this.emit('destroyed');

        } catch (err) {
            TribalWorkerError.catch(err);
        };
    };

    /**
     * Inicializa uma instância do Worker, anexando-a à janela mãe.
     * Se já houver uma instância ativa usando o nome escolhido, ela será destruída.
     */
    public async init(listener?: (event: Electron.MessageEvent) => void): Promise<void> {
        if (this.#isDestroyed.value) {
            throw new TribalWorkerError(`TribalWorker "${this.name}" is destroyed.`);
        };

        const aliveWorker = TribalWorker.getWorker(this.name);
        if (aliveWorker instanceof TribalWorker) {
            aliveWorker.destroy();
        };

        const webPreferences: Electron.WebPreferences = {
            spellcheck: false,
            preload: this.path,
            nodeIntegration: false,
            contextIsolation: true,
            devTools: process.env.ARES_MODE === 'dev'
        };

        const tribalWorker = new BrowserView({ webPreferences });
        const mainWindow = getMainWindow();
        mainWindow.addBrowserView(tribalWorker);

        tribalWorker.setBounds({ x: 0, y: 0, width: 0, height: 0 });
        tribalWorker.setAutoResize({ width: false, height: false, horizontal: false, vertical: false });
        tribalWorker.webContents.setAudioMuted(true);

        this.#browserView.value = tribalWorker;
        await tribalWorker.webContents.loadURL(this.url.href);

        this.#createMessageChannel();
        TribalWorker.setWorker(this.name, this);

        if (listener) this.port.on('message', listener);
        this.port.start();
    };

    public openDevTools() {
        this.webContents.openDevTools({ mode: 'detach' });
    };

    /** Permite aguardar até que o webContents do Worker esteja carregado. */
    public toBeReady(
        timeout: UntilOptions['timeout'] = 10000,
        throwOnTimeout: UntilOptions['throwOnTimeout'] = true,
        timeoutReason: UntilOptions['timeoutReason'] = `Worker "${this.name}" took too long to load.`
    ): Promise<void> {
        this.#isLoading.value = this.webContents.isLoading();
        return until(this.isReady).toBe(true, { timeout, throwOnTimeout, timeoutReason });
    };

    static readonly #active = new Map<TribalWorkerName, TribalWorker>();
    public static readonly deleteWorker = (name: TribalWorkerName) => TribalWorker.#active.delete(name);
    public static readonly getWorker = (name: TribalWorkerName) => TribalWorker.#active.get(name);
    public static readonly hasWorker = (name: TribalWorkerName) => TribalWorker.#active.has(name);
    public static readonly setWorker = (name: TribalWorkerName, worker: TribalWorker) => TribalWorker.#active.set(name, worker);

    /**
     * Cria uma URL com base no URL do `webContents` da view principal.
     * @param search String que será adicionada à query da URL.
     */
    public static createURL(search?: string): import('node:url').URL {
        const mainViewWebContents = getMainViewWebContents();
        const url = new URL(mainViewWebContents.getURL());
        if (typeof search === 'string') url.search = search;
        return url;
    };

    /**
     * Destrói um Worker, não apenas removendo-o da lista de instâncias ativas, mas também da janela mãe.
     * @param phobos Instância do Phobos.
     */
    public static destroyWorker(tribalWorker: TribalWorker | TribalWorkerName) {
        if (tribalWorker instanceof TribalWorker) {
            tribalWorker.destroy();
        } else {
            const worker = TribalWorker.getWorker(tribalWorker);
            if (worker instanceof TribalWorker) {
                worker.destroy();
            };
        };
    };

    public static getWorkerNameByWebContentsId(webContentsId: number): TribalWorkerName | null {
        for (const [name, worker] of this.#active.entries()) {
            if (worker.webContents.id === webContentsId) return name;
        };
        return null;
    };
};