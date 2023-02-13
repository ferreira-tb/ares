import { UserConfig } from '$tables/config.js';
import type { BrowserWindow } from 'electron';

export function setPanelEvents(panelWindow: BrowserWindow) {
    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });
};