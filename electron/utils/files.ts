import * as path from 'node:path';
import { app } from 'electron';

const userData = app.getPath('userData');

// Assets
export const appIcon = path.join(__dirname, 'favicon.ico');
export const database = path.join(userData, 'ares.db');

// JavaScript
export const browserJs = path.join(__dirname, 'browser.js');
export const ipcTribalJs = path.join(__dirname, 'ipc-tw.js');

export const childProcess = {
    fetchWorldData: path.join(__dirname, 'child-process/fetch-world-data.js')
} as const;

export const json = {
    plunderDemolitionTemplate: path.join(__dirname, 'json/plunder-demolition-template.json')
} as const;

// HTML
export const windowsHtml = path.join(__dirname, 'windows.html');
export const uiHtml = path.join(__dirname, 'ui.html');

// CSS
export const browserCss = path.join(__dirname, 'browser.css');