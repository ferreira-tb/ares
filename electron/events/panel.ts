import { UserConfig } from '$interface/index';
import { getPanelWindow } from '$electron/utils/helpers';

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