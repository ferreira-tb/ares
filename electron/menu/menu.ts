import { Menu, shell } from 'electron';
import { showErrorLog } from '$electron/app/modules.js';
import { aresURL, gameURL, repoURL, discordURL } from '$electron/utils/constants.js';
import { togglePanelWindow, getMainWindow, getPanelWindow } from '$electron/utils/helpers.js';
import { setBrowserDevMenu, setPanelDevMenu } from '$electron/menu/dev.js';
import type { MenuItemConstructorOptions } from 'electron';

export function setAppMenu() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

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

    // Adiciona o menu de desenvolvedor às janelas.
    setBrowserDevMenu(mainMenu);
    setPanelDevMenu(panelMenu);

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};