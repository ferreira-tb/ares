import { URL } from 'url';
import { BrowserView } from 'electron';
import { assertString, assertInstanceOf, isInstanceOf } from '$shared/guards';
import { getMainWindow } from '$electron/utils/helpers';
import { phobosJs } from '$electron/utils/files';

const activePhobos = new Map<PhobosNames, BrowserView>();

/**
 * Cria uma nova instância do Phobos e a anexa à janela mãe.
 * Se já houver uma instância criada com o nome escolhido, retorna-a em vez de criar uma nova.
 * Esse comportamento pode ser alterado ao atribuir a `true` à opção `override`.
 * Nesse caso, a instância anterior será destruída.
 * 
 * Uma nova instância deve SEMPRE ser inicializada com alguma URL.
 * @param name Nome da instância.
 * @param url URL que será carregada no Phobos.
 * @param mainWindow Janela mãe.
 * @param options Opções que determinam o comportamento do `BrowserView`.
 * É possível passar um objeto `WebPreferences` com uma das opções.
 */
export async function createPhobos(name: PhobosNames, url: URL, options?: PhobosOptions): Promise<BrowserView> {
    const mainWindow = getMainWindow();
    const alivePhobos = activePhobos.get(name);

    if (alivePhobos instanceof BrowserView) {
        if (options?.override === true) {
            mainWindow.removeBrowserView(alivePhobos);
            activePhobos.delete(name);

        } else {
            const oldUrl = new URL(alivePhobos.webContents.getURL());
            if (url.origin !== oldUrl.origin || options?.overrideUrl === true) {
                await alivePhobos.webContents.loadURL(url.href);
            };
            return alivePhobos;
        };
    };

    const webPreferences: Electron.WebPreferences = options?.webPreferences ?? {};
    webPreferences.preload = phobosJs;
    webPreferences.devTools = process.env.ARES_MODE === 'dev';

    const phobos = new BrowserView({ webPreferences });
    mainWindow.addBrowserView(phobos);

    phobos.setBounds(options?.bounds ?? {
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    phobos.setAutoResize(options?.autoResize ?? {
        width: false,
        height: false,
        horizontal: false,
        vertical: false
    });

    activePhobos.set(name, phobos);
    await phobos.webContents.loadURL(url.href);

    phobos.webContents.setAudioMuted(true);
    return phobos;
};

/** Obtém uma instância do Phobos a partir do nome. */
export function getPhobosByName(name: PhobosNames) {
    return activePhobos.get(name);
};

/**
 * Destrói uma instância do Phobos.
 * @param phobos Instância do Phobos.
 */
export function destroyPhobos(phobos: BrowserView) {
    assertInstanceOf(phobos, BrowserView, 'Object is not a BrowserView.');
    const mainWindow = getMainWindow();
    mainWindow.removeBrowserView(phobos);
    for (const [name, view] of activePhobos) {
        if (view === phobos) {
            activePhobos.delete(name);
            break;
        };
    };
};

/**
 * Destrói uma instância do Phobos a partir do nome.
 * @param name Nome da instância.
 */
export function destroyPhobosByName(name: PhobosNames) {
    assertString(name, `${name} is not a valid Phobos name.`);
    const phobos = activePhobos.get(name);
    if (isInstanceOf(phobos, BrowserView)) {
        const mainWindow = getMainWindow();
        mainWindow.removeBrowserView(phobos);
        activePhobos.delete(name);
    };
};

/** Destrói todas as instâncias do Phobos. */
export function destroyAllPhobos() {
    const mainWindow = getMainWindow();
    for (const phobos of activePhobos.values()) {
        mainWindow.removeBrowserView(phobos);
    };
    activePhobos.clear();
};