import { Menu } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

const helpMenu: MenuItemConstructorOptions[] = [
    { label: 'Repositório', enabled: false },
    { label: 'Suporte', enabled: false },

    { label: 'Atualizar', visible: false, accelerator: 'F5', role: 'reload' },
    { label: 'Forçar atualização', visible: false, accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
    { label: 'DevTools', visible: false, accelerator: 'F1', role: 'toggleDevTools' },
    { label: 'Fechar', visible: false, accelerator: 'Esc', role: 'quit' }
];

export const mainMenu = Menu.buildFromTemplate([
    { label: 'Ajuda', submenu: helpMenu }
] satisfies MenuItemConstructorOptions[]);