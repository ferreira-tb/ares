import { Menu, shell } from 'electron';
import type { BrowserWindow, MenuItemConstructorOptions } from 'electron';

export function setAppMenu(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    const authorURL = 'https://github.com/ferreira-tb';
    const repoURL = 'https://github.com/ferreira-tb/claustrophobia';
    const helpURL = 'https://github.com/ferreira-tb/claustrophobia/issues';
    
    const optionsMenu: MenuItemConstructorOptions[] = [
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];
    
    const helpMenu: MenuItemConstructorOptions[] = [
        { label: 'Autor', click: () => shell.openExternal(authorURL) },
        { label: 'Repositório', click: () => shell.openExternal(repoURL) },
        { label: 'Suporte', click: () => shell.openExternal(helpURL) }
    ];

    const devOnly: MenuItemConstructorOptions[] = [
        { label: 'Atualizar', visible: false, accelerator: 'F5', role: 'reload' },
        { label: 'Forçar atualização', visible: false, accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
        { label: 'Inspecionar', visible: false, accelerator: 'F1', role: 'toggleDevTools' },
    ];

    if (process.env.CLAUSTROPHOBIC_MODE === 'dev') {
        devOnly.forEach((option) => optionsMenu.push(option));
    };
    
    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);
    
    const childMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    mainWindow.setMenu(mainMenu);
    childWindow.setMenu(childMenu);
};