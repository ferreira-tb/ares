import { Menu, MenuItem, shell, BrowserWindow } from 'electron';
import { gameURL, authorURL, repoURL, helpURL } from './constants.js';
import { assert } from './error.js';
import { appendBasicDevMenu, setBasicDevMenu, showErrorLog } from './helpers.js';
import type { MenuItemConstructorOptions } from 'electron';

export function setAppMenu(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
        { label: 'Ocultar painel', id: 'hide-child', click: hideOrShowChildWindow },
        { label: 'Mostrar painel', id: 'show-child', visible: false, click: hideOrShowChildWindow },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Autor', click: () => shell.openExternal(authorURL) },
        { label: 'Repositório', click: () => shell.openExternal(repoURL) },
        { label: 'Suporte', click: () => shell.openExternal(helpURL) },
        { type: 'separator' },
        { label: 'Registro de erros', click: () => showErrorLog(mainWindow) }
    ];

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    appendBasicDevMenu(mainMenu);
    mainWindow.setMenu(mainMenu);

    setBasicDevMenu(childWindow);

    /** Declarada aqui dentro para ter acesso às variáveis do escopo. */
    function hideOrShowChildWindow() {
        const hideChild = mainMenu.getMenuItemById('hide-child');
        assert(hideChild instanceof MenuItem, '\"hide-child\" não foi encontrado no menu.');

        const showChild = mainMenu.getMenuItemById('show-child');
        assert(showChild instanceof MenuItem, '\"show-child\" não foi encontrado no menu.');

        if (childWindow.isVisible()) {
            childWindow.hide();
        } else {
            childWindow.show();
        };

        hideChild.visible = !hideChild.visible;
        showChild.visible = !showChild.visible;
    };
};