import { URL } from 'url';
import { BrowserView, MessageChannelMain, ipcMain } from 'electron';
import { assertString, assertInstanceOf, isInstanceOf } from '@tb-dev/ts-guard';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers.js';
import { phobosJs } from '$electron/utils/constants.js';
import type { WebPreferences } from 'electron';
import type { PhobosNames, PhobosOptions } from '$types/phobos.js';

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
    assertString(name, 'Nome inválido.');
    assertInstanceOf(url, URL, 'URL inválida');

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

    const webPreferences: WebPreferences = options?.webPreferences ?? {};
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

/** Phobos permanente. */
export async function createPhobosWorker(): Promise<BrowserView> {
    const mainWindow = getMainWindow();
    const url = mainWindow.webContents.getURL();
    const phobos = await createPhobos('worker', new URL(url), { override: true });
    phobos.webContents.on('will-navigate', (e) => e.preventDefault());

    const panelWindow = getPanelWindow();
    panelWindow.webContents.send('did-override-phobos-worker');

    return new Promise<BrowserView>((resolve, reject) => {
        ipcMain.once('phobos-worker-port-is-gone', () => {
            const { port1, port2 } = new MessageChannelMain();
            panelWindow.webContents.postMessage('port', null, [port1]);
            phobos.webContents.postMessage('port', null, [port2]);
            resolve(phobos);
        });

        setTimeout(() => reject(), 3000);
    });
};

export function getPhobosByName(name: PhobosNames) {
    return activePhobos.get(name);
};

export function destroyPhobos(phobos: BrowserView) {
    assertInstanceOf(phobos, BrowserView, 'O objeto não é um BrowserView.');
    const mainWindow = getMainWindow();
    mainWindow.removeBrowserView(phobos);
    for (const [name, view] of activePhobos) {
        if (view === phobos) {
            activePhobos.delete(name);
            break;
        };
    };
};

export function destroyPhobosByName(name: PhobosNames) {
    assertString(name, `${name} não é um nome válido para um Phobos.`);
    const phobos = activePhobos.get(name);
    if (isInstanceOf(phobos, BrowserView)) {
        const mainWindow = getMainWindow();
        mainWindow.removeBrowserView(phobos);
        activePhobos.delete(name);
    };
};

export function destroyAllPhobos() {
    const mainWindow = getMainWindow();
    for (const phobos of activePhobos.values()) {
        mainWindow.removeBrowserView(phobos);
    };
    activePhobos.clear();
};