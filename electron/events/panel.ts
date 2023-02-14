import { BrowserWindow } from 'electron';
import { UserConfig } from '$tables/config.js';
import { getPanelWindow } from '$electron/helpers.js';
import { assertType } from '$electron/error.js';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();
    assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');

    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });
};