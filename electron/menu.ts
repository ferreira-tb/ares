import { Menu, MenuItem, shell } from 'electron';
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

    const mainMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);
    
    const childMenu = Menu.buildFromTemplate([
        { label: 'Opções', submenu: optionsMenu },
        { label: 'Ajuda', submenu: helpMenu }
    ] satisfies MenuItemConstructorOptions[]);

    if (process.env.CLAUSTROPHOBIC_MODE === 'dev') {
        const devOnly: MenuItemConstructorOptions[] = [
            { label: 'Atualizar', accelerator: 'F5', role: 'reload' },
            { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
            { label: 'Inspecionar', accelerator: 'F1', role: 'toggleDevTools' },
        ];

        const mainDevOptions: MenuItemConstructorOptions[] = [...devOnly, { type: 'separator' }];
        const childDevOptions: MenuItemConstructorOptions[] = [...devOnly];

        mainDevOptions.push({ label: 'CSV Dataset', click: () => mainWindow.webContents.send('dev-report-dataset') });

        const mainDevMenu = new MenuItem({ label: 'Desenvolvedor', submenu: mainDevOptions });
        const childDevMenu = new MenuItem({ label: 'Desenvolvedor', submenu: childDevOptions });

        mainMenu.append(mainDevMenu);
        childMenu.append(childDevMenu);
    };

    mainWindow.setMenu(mainMenu);
    childWindow.setMenu(childMenu);
};