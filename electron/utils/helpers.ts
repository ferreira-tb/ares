import { BrowserWindow, Menu } from 'electron';
import { URL } from 'url';
import { devOptions } from '$electron/utils/constants.js';
import { assertType } from '$electron/utils/assert.js';

export const getMainWindow = () => {
    const id = Number.assertInteger(process.env.MAIN_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertMainWindow = () => {
    const mainWindow = getMainWindow();
    assertType(mainWindow instanceof BrowserWindow, 'Não foi possível obter a janela do browser.');
    return mainWindow;
};

export const getPanelWindow = () => {
    const id = Number.assertInteger(process.env.PANEL_WINDOW_ID ?? '', 10);
    return BrowserWindow.fromId(id);
};

export const assertPanelWindow = () => {
    const panelWindow = getPanelWindow();
    assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');
    return panelWindow;
};

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

export function getCurrentWorld() {
    const mainWindow = assertMainWindow();
    const currentURL = mainWindow.webContents.getURL();
    if (/\.?tribalwars/.test(currentURL)) {
        const url = new URL(currentURL);
        return getWorldFromURL(url);
    };

    return null;
};

export function assertCurrentWorld() {
    const world = getCurrentWorld();
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

export function togglePanelWindow() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    if (panelWindow.isVisible()) {
        panelWindow.hide();

        if (mainWindow.isVisible() && !mainWindow.isFocused()) {
            mainWindow.focus();
        };

    } else {
        panelWindow.show();
    };
};