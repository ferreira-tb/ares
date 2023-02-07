import { BrowserWindow, Menu } from 'electron';
import { URL } from 'node:url';
import { devOptions } from './constants.js';
import { assertType } from './error.js';

export function getWorldFromURL(url: URL) {
    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    let world = url.hostname.slice(0, index);
    world = world.replace(/www\.?/g, '');
    
    if (world.length < 1) return null;
    return world;
};

export function assertWorldFromURL(url: URL) {
    const world = getWorldFromURL(url);
    assertType(typeof world === 'string', 'Não foi possível determinar o mundo.');
    return world;
};

export function getCurrentWorld(mainWindow: BrowserWindow) {
    const currentURL = mainWindow.webContents.getURL();
    if (/\.?tribalwars/.test(currentURL)) {
        const url = new URL(currentURL);
        return getWorldFromURL(url);
    };

    return null;
};

export function assertCurrentWorld(mainWindow: BrowserWindow) {
    const world = getCurrentWorld(mainWindow);
    assertType(typeof world === 'string', 'O mundo é inválido.');
    return world;
};

/**
 * Adiciona um menu básico à janela, com opções para inspeção e atualização da página.
 * Se `setNull` for `true`, a janela ficará sem menu caso o Ares não esteja em modo de desenvolvedor.
 */
export function setBasicDevMenu(browserWindow: BrowserWindow, setNull: boolean = true) {
    assertType(browserWindow instanceof BrowserWindow, 'O item não é uma janela.');
    if (process.env.ARES_MODE !== 'dev') {
        if (setNull === true) browserWindow.setMenu(null);
        return;
    };

    const menu = Menu.buildFromTemplate(devOptions);
    browserWindow.setMenu(menu);
};