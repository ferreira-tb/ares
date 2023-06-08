import * as path from 'node:path';
import { BrowserView, MessageChannelMain } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';
import { MainProcessError } from '$electron/error';
import type { TribalWorkerName } from '$common/constants';

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
        if (this.#isDestroyed) return;

        if (this.#messagePort) {
            this.#messagePort.removeAllListeners().close();
            this.#messagePort = null;
        };
        
        const mainWindow = getMainWindow();
        mainWindow.removeBrowserView(this.view);
        TribalWorker.deleteWorker(this.name);

        this.#browserView = null;
        this.#isDestroyed = true;
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
    public static readonly deleteWorker = (name: TribalWorkerName) => TribalWorker.#active.delete(name);
    public static readonly getWorker = (name: TribalWorkerName) => TribalWorker.#active.get(name);
    public static readonly hasWorker = (name: TribalWorkerName) => TribalWorker.#active.has(name);
    public static readonly setWorker = (name: TribalWorkerName, worker: TribalWorker) => TribalWorker.#active.set(name, worker);

    /**
     * Destrói um Worker, não apenas removendo-o da lista de instâncias ativas, mas também da janela mãe.
     * @param phobos Instância do Phobos.
     */
    public static destroyWorker(tribalWorker: TribalWorker | TribalWorkerName) {
        if (tribalWorker instanceof TribalWorker) {
            tribalWorker.destroy();
        } else {
            const worker = TribalWorker.getWorker(tribalWorker);
            if (!(worker instanceof TribalWorker)) {
                throw new MainProcessError('A valid TribalWorker instance or name must be provided.');
            };

            worker.destroy();
        };
    };

    /** Destrói todas os Workers, removendo-os da janela mãe. */
    public static destroyAllWorkers() {
        for (const worker of this.#active.values()) {
            worker.destroy();
        };
    };
};