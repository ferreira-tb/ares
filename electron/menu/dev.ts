import { BrowserWindow, Menu, MenuItem, type MenuItemConstructorOptions } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import { devOptions } from '$electron/utils/constants.js';
import { assertMainWindow } from '$electron/utils/helpers.js';

/**
 * Adiciona um menu básico à janela, com opções para inspeção e atualização da página.
 * Se `setNull` for `true`, a janela ficará sem menu caso o Ares não esteja em modo de desenvolvedor.
 */
export function setBasicDevMenu(browserWindow: BrowserWindow, setNull: boolean = true) {
    assertInstanceOf(browserWindow, BrowserWindow, 'O item não é uma janela.');
    if (process.env.ARES_MODE !== 'dev') {
        if (setNull === true) browserWindow.setMenu(null);
        return;
    };

    const menu = Menu.buildFromTemplate(devOptions);
    browserWindow.setMenu(menu);
};

export function setBrowserDevMenu(menu: Menu) {
    if (process.env.ARES_MODE !== 'dev') return;
    assertInstanceOf(menu, Menu, 'O item não é um menu.');

    const mainWindow = assertMainWindow();

    const errorMenu: MenuItemConstructorOptions[] = [
        { label: 'Emitir erro', click: () => mainWindow.webContents.send('emit-mock-error') },
        { label: 'Emitir erro de DOM', click: () => mainWindow.webContents.send('emit-mock-dom-error') }
    ];

    const devMenu: MenuItemConstructorOptions[] = [
        ...devOptions,
        { type: 'separator' },
        { label: 'Erros', submenu: errorMenu }
    ];

    const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: devMenu });
    menu.append(menuItem);
};

export function setPanelDevMenu(menu: Menu) {
    if (process.env.ARES_MODE !== 'dev') return;
    assertInstanceOf(menu, Menu, 'O item não é um menu.');

    const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: devOptions });
    menu.append(menuItem);
};