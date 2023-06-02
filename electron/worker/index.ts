import { URL } from 'url';
import { BrowserView, MessageChannelMain } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';
import { tribalWorkerJs } from '$electron/utils/files';
import { MainProcessError } from '$electron/error';

export class TribalWorker {
    readonly name: TribalWorkerName;
    readonly url: URL;
    #options: TribalWorkerOptions | null = null;
    #browserView: BrowserView | null = null;
    #messagePort: Electron.MessagePortMain | null = null;

    /**
    * Uma nova instância deve SEMPRE ser inicializada com alguma URL.
    * @param name Nome da instância.
    * @param url URL que será carregada no Worker.
    * @param options Opções que determinam o comportamento do `BrowserView`.
    * É possível passar um objeto `WebPreferences` com uma das opções.
    */
    constructor(name: TribalWorkerName, url: URL, options?: TribalWorkerOptions) {
        this.name = name;
        this.url = url;
        if (options) this.#options = options;
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

    #createMessageChannel(): void {
        const { port1, port2 } = new MessageChannelMain();
        this.view.webContents.postMessage('port', null, [port2]);
        port1.postMessage({ channel: this.name } satisfies TribalWorkerPortMessage);

        this.#messagePort = port1;
    };

    /** Destroi a instância do Worker, removendo-a da janela mãe. */
    public destroy(): void {
        if (this.#messagePort) {
            this.#messagePort.removeAllListeners().close();
            this.#messagePort = null;
        };
        
        TribalWorker.destroyWorker(this.view);
        this.#browserView = null;
    };

    /**
     * Inicializa uma instância do Worker, anexando-a à janela mãe.
     * Se já houver uma instância ativa usando o nome escolhido, esse método a retornará, ignorando completamente a instância atual.
     * 
     * Esse comportamento pode ser alterado ao atribuir a `true` à opção `override` do construtor.
     * Nesse caso, a instância anterior será destruída.
     */
    public async init(portListener?: (event: Electron.MessageEvent) => void): Promise<void> {
        const mainWindow = getMainWindow();
        const aliveWorker = TribalWorker.getWorker(this.name);

        if (aliveWorker instanceof BrowserView) {
            if (this.#options?.override === true) {
                mainWindow.removeBrowserView(aliveWorker);
                TribalWorker.deleteWorker(this.name);

            } else {
                const oldUrl = new URL(aliveWorker.webContents.getURL());
                if (this.url.origin !== oldUrl.origin || this.#options?.overrideUrl === true) {
                    await aliveWorker.webContents.loadURL(this.url.href);
                };

                this.#browserView = aliveWorker;
                this.#createMessageChannel();
                return;
            };
        };

        const webPreferences: Electron.WebPreferences = this.#options?.webPreferences ?? {};
        webPreferences.preload = tribalWorkerJs;
        webPreferences.devTools = process.env.ARES_MODE === 'dev';

        const tribalWorker = new BrowserView({ webPreferences });
        mainWindow.addBrowserView(tribalWorker);

        tribalWorker.setBounds(this.#options?.bounds ?? {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        });

        tribalWorker.setAutoResize(this.#options?.autoResize ?? {
            width: false,
            height: false,
            horizontal: false,
            vertical: false
        });

        TribalWorker.setWorker(this.name, tribalWorker);
        await tribalWorker.webContents.loadURL(this.url.href);
        tribalWorker.webContents.setAudioMuted(true);
        
        this.#browserView = tribalWorker;
        this.#createMessageChannel();

        if (typeof portListener === 'function') {
            this.port.on('message', portListener);
            this.port.start();
        };
    };

    static readonly #active = new Map<TribalWorkerName, BrowserView>();
    public static readonly deleteWorker = (name: TribalWorkerName) => TribalWorker.#active.delete(name);
    public static readonly getWorker = (name: TribalWorkerName) => TribalWorker.#active.get(name);
    public static readonly hasWorker = (name: TribalWorkerName) => TribalWorker.#active.has(name);
    public static readonly setWorker = (name: TribalWorkerName, worker: BrowserView) => TribalWorker.#active.set(name, worker);

    /**
     * Destrói um Worker, não apenas removendo-o da lista de instâncias ativas, mas também da janela mãe.
     * @param phobos Instância do Phobos.
     */
    public static destroyWorker(tribalWorker: BrowserView | TribalWorkerName) {
        const worker = typeof tribalWorker === 'string' ? TribalWorker.getWorker(tribalWorker) : tribalWorker;

        if (!(worker instanceof BrowserView)) {
            throw new MainProcessError('Could not destroy TribalWorker: worker is not a BrowserView.');
        };

        const mainWindow = getMainWindow();
        mainWindow.removeBrowserView(worker);
        for (const [name, view] of this.#active.entries()) {
            if (view === worker) {
                this.deleteWorker(name);
                break;
            };
        };
    };

    /** Destrói todas os Workers, removendo-os da janela mãe. */
    public static destroyAllWorkers() {
        const mainWindow = getMainWindow();
        for (const tribalWorker of this.#active.values()) {
            mainWindow.removeBrowserView(tribalWorker);
        };

        this.#active.clear();
    };
};