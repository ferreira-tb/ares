import { ipcMain } from 'electron';
import { AppConfig } from '$interface/index';
import { getPanelWindow } from '$electron/utils/helpers';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();

    ipcMain.handle('is-panel-visible', () => panelWindow.isVisible());

    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await AppConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await AppConfig.savePanelBounds(rectangle);
    });
};