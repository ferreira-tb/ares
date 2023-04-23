import { ipcMain } from 'electron';
import { AppConfig } from '$electron/interface';
import { getPanelWindow } from '$electron/utils/helpers';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();

    ipcMain.handle('panel:is-visible', () => panelWindow.isVisible());

    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await AppConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await AppConfig.savePanelBounds(rectangle);
    });
};