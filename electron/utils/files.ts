import { app } from 'electron';
import { join } from 'node:path';

export const appIcon = join(__dirname, 'favicon.ico');
export const database = join(app.getPath('userData'), 'ares.db');

// JavaScript
export const browserJs = join(__dirname, 'browser.js');
export const ipcTribalJs = join(__dirname, 'ipc-tw.js');
export const phobosJs = join(__dirname, 'phobos.js');

export const childProcess = {
    worldData: join(__dirname, 'child-process/world-data.js')
} as const;

// HTML
export const moduleHtml = join(__dirname, 'modules.html');
export const panelHtml = join(__dirname, 'panel.html');
export const uiHtml = join(__dirname, 'ui.html');

// CSS
export const browserCss = join(__dirname, 'browser.css');