import { Menu, shell } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

const authorURL = 'https://github.com/ferreira-tb';
const repoURL = 'https://github.com/ferreira-tb/claustrophobia';
const helpURL = 'https://github.com/ferreira-tb/claustrophobia/issues';

const helpMenu: MenuItemConstructorOptions[] = [
    { label: 'Autor', click: () => shell.openExternal(authorURL) },
    { label: 'Repositório', click: () => shell.openExternal(repoURL) },
    { label: 'Suporte', click: () => shell.openExternal(helpURL) },

    { label: 'Atualizar', visible: false, accelerator: 'F5', role: 'reload' },
    { label: 'Forçar atualização', visible: false, accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
    { label: 'Inspecionar', visible: false, accelerator: 'F1', role: 'toggleDevTools' },
    { label: 'Fechar', visible: false, accelerator: 'Esc', role: 'quit' }
];

export const mainMenu = Menu.buildFromTemplate([
    { label: 'Ajuda', submenu: helpMenu }
] satisfies MenuItemConstructorOptions[]);

export const childMenu = Menu.buildFromTemplate([
    { label: 'Ajuda', submenu: helpMenu }
] satisfies MenuItemConstructorOptions[]);