import { join, resolve } from 'path';
import type { MenuItemConstructorOptions } from 'electron';

// URL
export const aresURL = 'https://tb.dev.br/ares';
export const gameURL = 'https://www.tribalwars.com.br/';
export const authorURL = 'https://github.com/ferreira-tb';
export const repoURL = 'https://github.com/ferreira-tb/ares';
export const issuesURL = 'https://github.com/ferreira-tb/ares/issues';
export const discordURL = 'https://discord.gg/tNQbrqbmdK';

// Arquivos
export const favicon = resolve(__dirname, '../public/favicon.ico');
export const indexHtml = join(__dirname, 'index.html');
export const browserJs = join(__dirname, 'browser.js');
export const browserCss = join(__dirname, 'browser.css');
export const deimosJs = join(__dirname, 'deimos.js');
export const phobosJs = join(__dirname, 'phobos.js');
export const moduleHtml = join(__dirname, 'modules.html');

// Menu
export const devOptions: MenuItemConstructorOptions[] = [
    { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', role: 'forceReload' },
    { label: 'Inspecionar', accelerator: 'F1', role: 'toggleDevTools' }
];