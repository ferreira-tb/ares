import * as path from 'node:path';
import { app } from 'electron';

const userData = app.getPath('userData');

// Assets
export const appIcon = path.join(__dirname, 'favicon.ico');
export const database = path.join(userData, 'ares.db');

// JavaScript
export const browserJs = path.join(__dirname, 'browser.js');
export const ipcTribalJs = path.join(__dirname, 'ipc-tw.js');

/** Caminhos para os arquivos usados pelos processos filhos. */
export const childProcess = {
    fetchWorldData: path.join(__dirname, 'child-process/fetch-world-data.js')
} as const;

// HTML
export const windowsHtml = path.join(__dirname, 'windows.html');
export const panelHtml = path.join(__dirname, 'panel.html');
export const uiHtml = path.join(__dirname, 'ui.html');

// CSS
export const browserCss = path.join(__dirname, 'browser.css');