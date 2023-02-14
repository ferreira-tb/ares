import { UserConfig } from '$tables/config.js';
import { assertPanelWindow } from '$electron/utils/helpers.js';

export function setPanelEvents() {
    const panelWindow = assertPanelWindow();

    panelWindow.on('moved', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });

    panelWindow.on('resized', async () => {
        const rectangle = panelWindow.getBounds();
        await UserConfig.savePanelBounds(rectangle);
    });
};