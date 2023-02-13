import { Menu, MenuItem, shell, BrowserWindow } from 'electron';
import { gameURL, authorURL, repoURL, helpURL, devOptions } from '$electron/constants.js';
import { assert } from '$electron/error.js';
import { showErrorLog } from '$electron/ares/modules.js';
import { setBasicDevMenu } from '$electron/helpers.js';
import type { MenuItemConstructorOptions } from 'electron';

export function setAppMenu(mainWindow: BrowserWindow, panelWindow: BrowserWindow) {
    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
        { label: 'Ocultar painel', id: 'hide-child', click: hideOrShowPanelWindow },
        { label: 'Mostrar painel', id: 'show-child', visible: false, click: hideOrShowPanelWindow },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Site', click: () => shell.openExternal(repoURL) },
        { label: 'Autor', click: () => shell.openExternal(authorURL) },
        { label: 'Suporte', click: () => shell.openExternal(helpURL) },
        { type: 'separator' },
        { label: 'Registro de erros', click: () => showErrorLog(mainWindow) }
    ];

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    if (process.env.ARES_MODE === 'dev') {
        const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: devOptions });
        mainMenu.append(menuItem);
    };

    mainWindow.setMenu(mainMenu);
    setBasicDevMenu(panelWindow);

    /** Declarada aqui dentro para ter acesso às variáveis do escopo. */
    function hideOrShowPanelWindow() {
        const hideChild = mainMenu.getMenuItemById('hide-child');
        assert(hideChild instanceof MenuItem, '\"hide-child\" não foi encontrado no menu.');

        const showChild = mainMenu.getMenuItemById('show-child');
        assert(showChild instanceof MenuItem, '\"show-child\" não foi encontrado no menu.');

        if (panelWindow.isVisible()) {
            panelWindow.hide();
        } else {
            panelWindow.show();
        };

        hideChild.visible = !hideChild.visible;
        showChild.visible = !showChild.visible;
    };
};