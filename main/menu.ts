import { Menu } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

const helpMenu: MenuItemConstructorOptions[] = [
    { label: 'Repositório', enabled: false },
    { label: 'Suporte', enabled: false }
];

export const mainMenu = Menu.buildFromTemplate([
    { label: 'Ajuda', submenu: helpMenu }
] satisfies MenuItemConstructorOptions[]);