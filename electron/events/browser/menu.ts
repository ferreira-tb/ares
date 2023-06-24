import { ipcMain, Menu } from 'electron';
import { BrowserTab } from '$electron/tabs';
import { appConfig } from '$electron/stores';

export function setContextMenuEvents() {
    ipcMain.on('browser:show-context-menu', (_e, options: ContextMenuOptions) => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Voltar', id: 'go-back', click: () => BrowserTab.current.goBack() },
            { label: 'Avançar', id: 'go-forward', click: () => BrowserTab.current.goForward() },
            { label: 'Atualizar', id: 'reload', click: () => BrowserTab.current.reload() }
        ];

        template.forEach((item) => {
            if (item.id === 'go-back') item.enabled = BrowserTab.current.canGoBack();
            else if (item.id === 'go-forward') item.enabled = BrowserTab.current.canGoForward();
        });

        const devTools = appConfig.get('advanced').devTools;
        if (devTools) {
            const devTemplate: Electron.MenuItemConstructorOptions[] = [
                { type: 'separator' },
                { label: 'Inspecionar', click: () => BrowserTab.current.inspectElement(options.x, options.y) }
            ];

            template.push(...devTemplate);
        }

        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    });
}