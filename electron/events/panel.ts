import { UserConfig } from '$interface/interface.js';
import { getPanelWindow } from '$electron/utils/helpers.js';

export function setPanelEvents() {
    const panelWindow = getPanelWindow();

    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });
};