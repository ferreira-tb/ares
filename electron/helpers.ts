import { BrowserWindow, Menu, MenuItem } from 'electron';
import { URL } from 'node:url';
import { favicon, moduleHtml, devOptions } from './constants.js';
import { assertType } from './error.js';

export function getWorldFromURL(url: URL) {
    const index = url.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    const world = url.hostname.slice(0, index);
    return world.replace(/www\.?/g, '');
};

export function assertWorldFromURL(url: URL) {
    const world = getWorldFromURL(url);
    assertType(typeof world === 'string', 'Não foi possível determinar o mundo.');
    return world;
};

export function getCurrentWorld(mainWindow: BrowserWindow) {
    const currentURL = mainWindow.webContents.getURL();
    if (!currentURL.includes('tribalwars')) return null;
    
    const url = new URL(currentURL);
    return getWorldFromURL(url);
};

export function assertCurrentWorld(mainWindow: BrowserWindow) {
    const world = getCurrentWorld(mainWindow);
    assertType(typeof world === 'string', 'O mundo é inválido.');
    return world;
};

export function appendBasicDevMenu(menu: Menu) {
    assertType(menu instanceof Menu, 'O item não é um menu.');
    if (process.env.ARES_MODE !== 'dev') return;
    
    const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: devOptions });
    menu.append(menuItem);
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

export function showErrorLog(mainWindow: BrowserWindow) {
    const errorLogWindow = new BrowserWindow({
        parent: mainWindow,
        width: 500,
        height: 600,
        useContentSize: true,
        show: false,
        title: 'Registro de erros',
        icon: favicon,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    setBasicDevMenu(errorLogWindow, true);
    errorLogWindow.loadFile(moduleHtml);
    errorLogWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

    errorLogWindow.once('ready-to-show', () =>  {
        errorLogWindow.webContents.send('set-module-route', 'error-log');
        errorLogWindow.show();
    });
};