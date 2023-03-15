import { Menu, shell } from 'electron';
import { showErrorLog, showAppConfig, openAresWebsite, openRepoWebsite, openIssuesWebsite } from '$electron/app/modules.js';
import { gameURL, discordURL } from '$electron/utils/constants.js';
import { togglePanelWindow, getMainViewWebContents, getMainWindow, getPanelWindow, restartAres } from '$electron/utils/helpers.js';
import { setBrowserDevMenu, setPanelDevMenu } from '$electron/menu/dev.js';
import type { MenuItemConstructorOptions } from 'electron';

// F1 - DevTools (apenas no modo de desenvolvimento).
// F2 - Exibe ou oculta o painel.
// F3 - Configurações.
// F4 - Scripts.
// F5 - Atualiza a página.

export function setAppMenu() {
    const mainWindow = getMainWindow();
    const mainViewWebContents = getMainViewWebContents();
    const panelWindow = getPanelWindow();

    const localeMenu: MenuItemConstructorOptions[] = [
        { label: 'Brasil', type: 'radio' },
        { label: 'Portugal', type: 'radio', enabled: false }
    ];

    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => mainViewWebContents.loadURL(gameURL) },
        { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
        { type: 'separator' },
        { label: 'Região', submenu: localeMenu },
        { label: 'Configurações', accelerator: 'F3', click: () => showAppConfig('general-config') },
        { type: 'separator' },
        { label: 'Reiniciar', accelerator: 'CmdOrCtrl+Esc', click: () => restartAres() },
        { label: 'Sair', accelerator: 'Esc', role: 'quit' },

        // Não-visíveis.
        { label: 'Exibir ou ocultar painel', visible: false, accelerator: 'F2', click: () => togglePanelWindow() },
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Site', click: () => openAresWebsite() },
        { label: 'Repositório', click: () => openRepoWebsite() },
        { label: 'Discord', click: () => shell.openExternal(discordURL) },
        { type: 'separator' },
        { label: 'Registro de erros', click: () => showErrorLog() },
        { label: 'Problemas conhecidos', click: () => openIssuesWebsite() }
    ];

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Scripts', enabled: false, accelerator: 'F4' },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    const panelMenu = Menu.buildFromTemplate([
        { label: 'Início', visible: false, accelerator: 'CmdOrCtrl+Home', click: () => mainViewWebContents.loadURL(gameURL) },
        { label: 'Painel', visible: false, accelerator: 'F2', click: () => togglePanelWindow() },
        { label: 'Configurações', visible: false, accelerator: 'F3', click: () => showAppConfig('general-config') },
        { label: 'Atualizar', visible: false, accelerator: 'F5', click: () => mainViewWebContents.reload() },
    ] satisfies MenuItemConstructorOptions[]);

    // Adiciona o menu de desenvolvedor às janelas.
    setBrowserDevMenu(mainMenu);
    setPanelDevMenu(panelMenu);

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};