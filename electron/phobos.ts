import { BrowserView } from 'electron';
import { URL } from 'node:url';
import { phobosJs } from './constants.js';
import { assertType } from './error.js';
import type { BrowserWindow } from 'electron';
import type { PhobosNames, CreatePhobosOptions } from './types.js';

const activePhobos = new Map<PhobosNames, BrowserView>();

/**
 * Cria uma nova instância do Phobos e a anexa à janela mãe.
 * Se já houver uma instância criada com o nome escolhido, retorna-a em vez de criar uma nova.
 * Esse comportamento pode ser alterado ao atribuir a `true` à opção `override`.
 * Nesse caso, a instância anterior será destruída.
 * 
 * Uma nova instância deve SEMPRE ser inicializada com alguma URL.
 * @param name Nome da instância.
 * @param mainWindow Janela mãe.
 * @param url URL que será carregada no Phobos.
 * @returns `BrowserView`
 */
export async function createPhobos(name: PhobosNames, url: URL, mainWindow: BrowserWindow, options?: CreatePhobosOptions) {
    assertType(typeof name === 'string', 'Nome inválido.');
    assertType(url instanceof URL, 'URL inválida');

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

    const phobos = new BrowserView({
        webPreferences: { preload: phobosJs }
    });

    mainWindow.addBrowserView(phobos);
    phobos.setBounds({ x: 0, y: 0, width: 0, height: 0 });
    phobos.setAutoResize({ width: false, height: false, horizontal: false, vertical: false });
    activePhobos.set(name, phobos);

    await phobos.webContents.loadURL(url.href);

    return phobos;
};