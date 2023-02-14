import { BrowserWindow, BrowserView, type WebPreferences } from 'electron';
import { URL } from 'url';
import { getMainWindow } from '$electron/helpers.js';
import { phobosJs } from '$electron/constants.js';
import { assertType } from '$electron/error.js';
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
export async function createPhobos(name: PhobosNames, url: URL, options?: PhobosOptions) {
    assertType(typeof name === 'string', 'Nome inválido.');
    assertType(url instanceof URL, 'URL inválida');

    const mainWindow = getMainWindow();
    assertType(mainWindow instanceof BrowserWindow, 'Não foi possível obter a janela do browser.');

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

    return phobos;
};