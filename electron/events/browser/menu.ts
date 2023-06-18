import { ipcMain, Menu } from 'electron';
import { storeToRefs } from 'mechanus';
import { MainWindow, PanelWindow, StandardWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { useCacheStore } from '$electron/stores';
import { StandardWindowName } from '$common/constants';

export function setContextMenuEvents() {
    const mainWindow = MainWindow.getInstance();
    const panelWindow = PanelWindow.getInstance();

    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    ipcMain.on('browser:show-context-menu', () => {
        const template: Electron.MenuItemConstructorOptions[] = [];

        if (userAlias.value) {
            const groupsTemplate: Electron.MenuItemConstructorOptions[] = [
                { label: 'Modelos', click: () => StandardWindow.open(StandardWindowName.GroupTemplate) }
            ];

            template.push({ label: 'Grupos', submenu: groupsTemplate });
        };

        if (process.env.ARES_MODE === 'dev') {
            const inspectTemplate: Electron.MenuItemConstructorOptions[] = [
                { label: 'Aba', click: () => BrowserTab.current.openDevTools() },
                { label: 'Janela', click: () => mainWindow.openDevTools() },
                { label: 'Painel', click: () => panelWindow.openDevTools() }
            ];

            if (template.length > 0) template.push({ type: 'separator' });

            const devTemplate: Electron.MenuItemConstructorOptions[] = [
                { label: 'Inspecionar', submenu: inspectTemplate }
            ];

            template.push(...devTemplate);
        };

        if (template.length === 0) return;
        const menu = Menu.buildFromTemplate(template);
        menu.popup();
    });
};