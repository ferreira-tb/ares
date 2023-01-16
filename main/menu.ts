import { Menu } from 'electron';
import type { MenuItemConstructorOptions } from 'electron';

export const mainMenu = Menu.buildFromTemplate([
    { label: 'Opções' },
    { label: 'Ajuda' }
] satisfies MenuItemConstructorOptions[]);