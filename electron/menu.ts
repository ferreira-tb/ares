import { Menu, MenuItem, shell, BrowserWindow } from 'electron';
import { aresURL, gameURL, repoURL, discordURL, devOptions } from '$electron/constants.js';
import { showErrorLog } from '$electron/ares/modules.js';
import { togglePanelWindow } from '$electron/helpers.js';
import type { MenuItemConstructorOptions } from 'electron';

export function setAppMenu(mainWindow: BrowserWindow, panelWindow: BrowserWindow) {
    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
        { type: 'separator' },
        { label: 'Configurações', accelerator: 'F3', enabled: false },
        { type: 'separator' },
        { label: 'Sair', accelerator: 'Esc', role: 'quit' },

        // Não-visíveis.
        { label: 'Painel', visible: false, accelerator: 'F2', click: () => togglePanelWindow(mainWindow, panelWindow) }
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Site', click: () => shell.openExternal(aresURL) },
        { label: 'Git Hub', click: () => shell.openExternal(repoURL) },
        { label: 'Discord', click: () => shell.openExternal(discordURL) },
        { type: 'separator' },
        { label: 'Registro de erros', click: () => showErrorLog(mainWindow) }
    ];

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    const panelMenu = Menu.buildFromTemplate([
        { label: 'Início', visible: false, accelerator: 'CmdOrCtrl+Home', click: () => mainWindow.webContents.loadURL(gameURL) },
        { label: 'Painel', visible: false, accelerator: 'F2', click: () => togglePanelWindow(mainWindow, panelWindow) },
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