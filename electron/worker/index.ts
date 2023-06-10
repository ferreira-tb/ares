import * as path from 'node:path';
import { BrowserView, MessageChannelMain } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessError } from '$electron/error';
import { getMainViewWebContents } from '$electron/utils/view';
import type { TribalWorkerName } from '$common/constants';

type TribalWorkerEventChannel = 'did-create-worker' | 'did-destroy-worker';
type TribalWorkerEvent = {
    workerName: TribalWorkerName;
};

export class TribalWorker {
    /** URL que será carregada no Worker. */
    readonly url: import('node:url').URL;
    
    #browserView: BrowserView | null = null;
    #isDestroyed: boolean = false;
    #messagePort: Electron.MessagePortMain | null = null;
    #name: TribalWorkerName | null = null;
    #workerPath: string | null = null;

    constructor(name: TribalWorkerName, url: import('node:url').URL) {
        this.name = name;
        this.url = url;

        TribalWorker.triggerEvent('did-create-worker', { workerName: this.name });
    };

    get isDestroyed(): boolean {
        return this.#isDestroyed;
    };

    get name(): TribalWorkerName {
        if (!this.#name) {
            throw new MainProcessError('TribalWorker name is not defined.');
        };
        return this.#name;
    };

    set name(name: TribalWorkerName) {
        this.#name = name;
        this.#workerPath = path.join(__dirname, `worker/${name}.js`);
    };

    /** Equivalente a `webContents.on()`. */
    get on(): Electron.WebContents['on'] {
        return this.view.webContents.on.bind(this.view.webContents);
    };

    /** Equivalente a `webContents.once()`. */
    get once(): Electron.WebContents['once'] {
        return this.view.webContents.once.bind(this.view.webContents);
    };

    get path(): string {
        if (!this.#workerPath) {
            throw new MainProcessError(`There is no path for TribalWorker "${this.name}".`);
        };
        return this.#workerPath;
    };

    get port(): Electron.MessagePortMain {
        if (!this.#messagePort) {
            throw new MainProcessError(`There is no message port for TribalWorker "${this.name}".`);
        };
        return this.#messagePort;
    };

    /** Envia uma mensagem para o Worker através do MessageChannel. */
    get postMessage(): Electron.MessagePortMain['postMessage'] {
        return this.port.postMessage.bind(this.port);
    };

    /** Envia uma mensagem para o Worker através do WebContents. */
    get postMessageToWebContents(): Electron.WebContents['postMessage'] {
        return this.view.webContents.postMessage.bind(this.view.webContents);
    };

    /** Equivalente a `webContents.send()`. */
    get send(): Electron.WebContents['send'] {
        return this.view.webContents.send.bind(this.view.webContents);
    };

    get view(): BrowserView {
        if (!(this.#browserView instanceof BrowserView)) {
            throw new MainProcessError(`TribalWorker "${this.name}" is not initialized.`);
        };
        return this.#browserView;
    };

    get webContents(): Electron.WebContents {
        return this.view.webContents;
    };

    #createMessageChannel(): void {
        const { port1, port2 } = new MessageChannelMain();
        this.view.webContents.postMessage('port', null, [port2]);
        port1.postMessage({ channel: this.name });
        this.#messagePort = port1;
    };

    /** Destroi a instância do Worker, removendo-a da janela mãe. */
    public destroy(): void {
        try {
            if (this.#isDestroyed) return;

            if (this.#messagePort) {
                this.#messagePort.removeAllListeners().close();
                this.#messagePort = null;
            };

            if (this.#browserView) {
                this.#browserView.webContents.removeAllListeners();
            };
            
            const mainWindow = getMainWindow();
            mainWindow.removeBrowserView(this.view);
            TribalWorker.deleteWorker(this.name);

            this.#browserView = null;
            this.#isDestroyed = true;

            TribalWorker.triggerEvent('did-destroy-worker', { workerName: this.name });

        } catch (err) {
            MainProcessError.catch(err);
        };
    };

    public hasView(): boolean {
        return this.#browserView instanceof BrowserView;
    };

    /**
     * Inicializa uma instância do Worker, anexando-a à janela mãe.
     * Se já houver uma instância ativa usando o nome escolhido, ela será destruída.
     */
    public async init(listener?: (event: Electron.MessageEvent) => void): Promise<void> {
        if (this.#isDestroyed) {
            throw new MainProcessError(`TribalWorker "${this.name}" is destroyed.`);
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
        await tribalWorker.webContents.loadURL(this.url.href);
        
        this.#browserView = tribalWorker;
        this.#createMessageChannel();
        TribalWorker.setWorker(this.name, this);

        if (typeof listener === 'function') this.port.on('message', listener);
        this.port.start();
    };

    public openDevTools() {
        this.view.webContents.openDevTools({ mode: 'detach' });
    };

    static readonly #active = new Map<TribalWorkerName, TribalWorker>();
    static readonly #listeners = new Map<TribalWorkerEventChannel, Set<(e: TribalWorkerEvent) => void>>();

    public static readonly deleteWorker = (name: TribalWorkerName) => TribalWorker.#active.delete(name);
    public static readonly getWorker = (name: TribalWorkerName) => TribalWorker.#active.get(name);
    public static readonly hasWorker = (name: TribalWorkerName) => TribalWorker.#active.has(name);
    public static readonly setWorker = (name: TribalWorkerName, worker: TribalWorker) => TribalWorker.#active.set(name, worker);

    public static addListener(channel: TribalWorkerEventChannel, listener: (e: TribalWorkerEvent) => void) {
        const listeners = this.#listeners.get(channel) ?? new Set();
        listeners.add(listener);
        TribalWorker.#listeners.set(channel, listeners);
    };

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

    /** Destrói todas os Workers, removendo-os da janela mãe. */
    public static destroyAllWorkers() {
        for (const worker of this.#active.values()) {
            worker.destroy();
        };
    };

    public static removeListener(channel: TribalWorkerEventChannel, listener: (e: TribalWorkerEvent) => void) {
        const listeners = this.#listeners.get(channel);
        if (listeners instanceof Set) {
            listeners.delete(listener);
            if (listeners.size === 0) {
                TribalWorker.#listeners.delete(channel);
            };
        };
    };

    public static removeAllListeners(channel?: TribalWorkerEventChannel) {
        if (typeof channel === 'string') {
            TribalWorker.#listeners.delete(channel);
        } else {
            TribalWorker.#listeners.clear();
        };
    };

    public static triggerEvent(channel: TribalWorkerEventChannel, event: TribalWorkerEvent) {
        const listeners = TribalWorker.#listeners.get(channel);
        if (listeners instanceof Set) {
            for (const listener of listeners) {
                listener(event);
            };
        };
    };
};