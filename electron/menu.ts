import { Menu, MenuItem, shell, BrowserWindow } from 'electron';
import { showErrorLog } from '$electron/app/modules.js';
import { assertType } from '$electron/error.js';
import { aresURL, gameURL, repoURL, discordURL, devOptions } from '$electron/constants.js';
import { togglePanelWindow, getMainWindow, getPanelWindow } from '$electron/helpers.js';
import type { MenuItemConstructorOptions } from 'electron';

export function setAppMenu() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    assertType(mainWindow instanceof BrowserWindow, 'Não foi possível obter a janela do browser.');
    assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');

    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
        { type: 'separator' },
        { label: 'Configurações', accelerator: 'F3', enabled: false },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Esc', role: 'quit' },

        // Não-visíveis.
        { label: 'Painel', visible: false, accelerator: 'F2', click: togglePanelWindow }
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Site', click: () => shell.openExternal(aresURL) },
        { label: 'Git Hub', click: () => shell.openExternal(repoURL) },
        { label: 'Discord', click: () => shell.openExternal(discordURL) },
        { type: 'separator' },
        { label: 'Registro de erros', click: showErrorLog }
    ];

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    const panelMenu = Menu.buildFromTemplate([
        { label: 'Início', visible: false, accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Painel', visible: false, accelerator: 'F2', click: togglePanelWindow },
        { label: 'Configurações', visible: false, accelerator: 'F3', enabled: false },
        { label: 'Atualizar', visible: false, accelerator: 'F5', click: () => mainWindow.webContents.reload() },
    ] satisfies MenuItemConstructorOptions[]);

    if (process.env.ARES_MODE === 'dev') {
        const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: devOptions });
        mainMenu.append(menuItem);
        panelMenu.append(menuItem);
    };

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};