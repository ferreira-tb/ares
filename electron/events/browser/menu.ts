import { ipcMain, Menu } from 'electron';
import { MainWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { appConfig } from '$electron/stores';

export function setContextMenuEvents() {
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('browser:show-context-menu', (_e, options: BrowserContextMenuOptions) => {
        const template: Electron.MenuItemConstructorOptions[] = [
            { label: 'Voltar', id: 'go-back', click: () => BrowserTab.current.goBack() },
            { label: 'Avançar', id: 'go-forward', click: () => BrowserTab.current.goForward() },
            { label: 'Atualizar', id: 'reload', click: () => BrowserTab.current.reload() }
        ];

        template.forEach((item) => {
            if (item.id === 'reload') return;
            if (item.id === 'go-back' && !BrowserTab.current.canGoBack()) item.enabled = false;
            if (item.id === 'go-forward' && !BrowserTab.current.canGoForward()) item.enabled = false;
        });

        const devTools = appConfig.get('advanced').devTools;
        if (devTools) {
            const inspectTemplate: Electron.MenuItemConstructorOptions[] = [
                { label: 'Página', click: () => BrowserTab.current.inspectElement(options.x, options.y) },
                { label: 'Interface', click: () => mainWindow.openDevTools() }
            ];

            if (template.length > 0) template.push({ type: 'separator' });

            const devTemplate: Electron.MenuItemConstructorOptions[] = [
                { label: 'Inspecionar', submenu: inspectTemplate }
            ];

            template.push(...devTemplate);
        }

        if (template.length === 0) return;
        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    });
}