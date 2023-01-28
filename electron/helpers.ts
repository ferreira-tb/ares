import { URL } from 'url';
import { assertType } from './error.js';
import type { BrowserWindow } from 'electron';

export function getCurrentWorld(mainWindow: BrowserWindow) {
    const currentURL = mainWindow.webContents.getURL();
    if (!currentURL.includes('tribalwars')) return null;
    
    const urlObject = new URL(currentURL);
    const index = urlObject.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    
    const world = urlObject.hostname.slice(0, index);
    return world.replace(/www\.?/g, '');
};

export function assertCurrentWorld(mainWindow: BrowserWindow) {
    const world = getCurrentWorld(mainWindow);
    assertType(typeof world === 'string', 'O mundo é inválido.');
    return world;
};