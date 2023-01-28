import { resolve } from 'path';

// URL
export const gameURL = 'https://www.tribalwars.com.br/';
export const authorURL = 'https://github.com/ferreira-tb';
export const repoURL = 'https://github.com/ferreira-tb/ares';
export const helpURL = 'https://github.com/ferreira-tb/ares/issues';

// Arquivos
export const favicon = resolve(__dirname, '../public/favicon.ico');
export const indexHtml = resolve(__dirname, 'index.html');
export const preloadJs = resolve(__dirname, 'game.js');
export const phobosJs = resolve(__dirname, 'phobos.js');
export const styleCss = resolve(__dirname, 'style.css');
export const deimosExe = resolve(__dirname, '../__testpy__/deimos.exe');