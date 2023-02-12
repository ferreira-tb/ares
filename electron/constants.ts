import { resolve } from 'path';
import type { MenuItemConstructorOptions } from 'electron';

// URL
export const gameURL = 'https://www.tribalwars.com.br/';
export const authorURL = 'https://github.com/ferreira-tb';
export const repoURL = 'https://github.com/ferreira-tb/ares';
export const helpURL = 'https://github.com/ferreira-tb/ares/issues';

// Arquivos
export const favicon = resolve(__dirname, '../public/favicon.ico');
export const indexHtml = resolve(__dirname, 'index.html');
export const browserJs = resolve(__dirname, 'browser.js');
export const phobosJs = resolve(__dirname, 'phobos.js');
export const styleCss = resolve(__dirname, 'style.css');
export const moduleHtml = resolve(__dirname, 'modules.html');

// Menu
export const devOptions: MenuItemConstructorOptions[] = [
    { label: 'Forçar atualização', accelerator: 'F6', role: 'forceReload' },
    { label: 'Inspecionar', accelerator: 'F1', role: 'toggleDevTools' }
];