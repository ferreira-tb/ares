import { ipcMain } from 'electron';
import { appConfig } from '$electron/stores';
import { getPanelWindow } from '$electron/utils/helpers';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();

    ipcMain.handle('panel:is-visible', () => panelWindow.isVisible());

    panelWindow.on('moved', () => {
        const rectangle = panelWindow.getBounds();
        appConfig.set('panel', { bounds: rectangle });
    });

    panelWindow.on('resized', () => {
        const rectangle = panelWindow.getBounds();
        appConfig.set('panel', { bounds: rectangle });
    });
};