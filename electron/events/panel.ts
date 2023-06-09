import { ipcMain } from 'electron';
import { appConfig } from '$electron/stores';
import { getPanelWindow } from '$electron/utils/helpers';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();

    ipcMain.handle('panel:is-visible', () => panelWindow.isVisible());

    panelWindow.on('moved', saveBounds(panelWindow));
    panelWindow.on('resized', saveBounds(panelWindow));
};

function saveBounds(panelWindow: Electron.CrossProcessExports.BrowserWindow) {
    return function() {
        const rectangle = panelWindow.getBounds();
        appConfig.set('panel', { bounds: rectangle });
    };
};