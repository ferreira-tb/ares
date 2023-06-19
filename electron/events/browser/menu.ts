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

        if (userAlias.value) {
            template.push({ type: 'separator' });
            template.push({ label: 'Ferramentas', submenu: tools() });
            template.push({ label: 'Grupos', submenu: groups() });
            template.push({ label: 'Tropas', submenu: troops() });
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

function groups(): Electron.MenuItemConstructorOptions[] {
    return [
        { label: 'Modelos', click: () => StandardWindow.open(StandardWindowName.GroupTemplate) }
    ];
};

function tools(): Electron.MenuItemConstructorOptions[] {
    return [
        { 
            label: 'Saque', submenu: [
                { label: 'Histórico', click: () => StandardWindow.open(StandardWindowName.PlunderHistory) }
            ] 
        }
    ];
};

function troops(): Electron.MenuItemConstructorOptions[] {
    return [
        { label: 'Contador', click: () => StandardWindow.open(StandardWindowName.TroopCounter) }
    ];
};