import { URL } from 'url';
import type { BrowserWindow } from 'electron';

export function getCurrentWorld(mainWindow: BrowserWindow) {
    const currentURL = mainWindow.webContents.getURL();
    if (!currentURL.includes('tribalwars')) return null;
    
    const urlObject = new URL(currentURL);
    const index = urlObject.hostname.indexOf('.tribalwars');
    if (index === -1) return null;
    return urlObject.hostname.slice(0, index);
};