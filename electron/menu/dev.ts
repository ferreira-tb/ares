import { BrowserWindow, Menu, MenuItem, type MenuItemConstructorOptions } from 'electron';
import { assertInstanceOf } from '@tb-dev/ts-guard';
import { getMainViewWebContents } from '$electron/utils/view';
import { MainProcessError } from '$electron/error';

const devOptions: MenuItemConstructorOptions[] = [
    { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
    { label: 'Inspecionar', accelerator: 'F1', role: 'toggleDevTools' }
];

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

    const mainViewWebContents = getMainViewWebContents();

    const errorMenu: MenuItemConstructorOptions[] = [
        { label: 'Emitir erro', click: () => mainViewWebContents.send('emit-mock-error') },
        { label: 'Emitir erro de DOM', click: () => mainViewWebContents.send('emit-mock-dom-error') },
        { label: 'Emitir erro no núcleo', click: () => emitMockMainProcessError() }
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

/** Emite um erro falso no processo principal para fins de teste. */
function emitMockMainProcessError() {
    const error = new MainProcessError('Isso é um teste.');
    MainProcessError.catch(error);
};