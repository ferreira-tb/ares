import { BrowserWindow, Menu, MenuItem } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import type { useBrowserViewStore } from '$interface/index';
import type { MenuItemConstructorOptions, WebContents } from 'electron';

function getDevOptions(browserViewStore: ReturnType<typeof useBrowserViewStore>): MenuItemConstructorOptions[] {
    const { webContents: mainContents } = getMainWindow();
    const { webContents: panelContents } = getPanelWindow();
    const { currentWebContents: currentWebContentsMaybeNull } = storeToRefs(browserViewStore);

    const contents = computed<WebContents>([currentWebContentsMaybeNull], () => {
        return currentWebContentsMaybeNull.value ?? getMainViewWebContents();
    });

    const options: MenuItemConstructorOptions[] = [
        { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => contents.value.reloadIgnoringCache() },
        { label: 'Inspecionar', accelerator: 'F10', click: () => contents.value.openDevTools({ mode: 'detach'}) },
        { label: 'Inspecionar janela principal', accelerator: 'F11', click: () => mainContents.openDevTools({ mode: 'detach'}) },
        { label: 'Inspecionar painel', accelerator: 'F12', click: () => panelContents.openDevTools({ mode: 'detach'}) },
    ];

    options.forEach((option) => option.visible = false);
    return options;
};

/** Adiciona o menu de desenvolvedor à janela. */
export function setDevMenu(browserViewStore: ReturnType<typeof useBrowserViewStore>, ...args: BrowserWindow[]) {
    const options = getDevOptions(browserViewStore);
    for (const browserWindow of args) {
        if (process.env.ARES_MODE !== 'dev') {
            browserWindow.setMenu(null);
            continue;
        };
    
        const menu = Menu.buildFromTemplate(options);
        browserWindow.setMenu(menu);
    };
};

/** Adiciona o menu de desenvolvedor a menus já existentes. */
export function appendDevMenu(browserViewStore: ReturnType<typeof useBrowserViewStore>, ...args: Menu[]) {
    if (process.env.ARES_MODE !== 'dev') return;
    
    const options = getDevOptions(browserViewStore);
    for (const menu of args) {
        const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: options });
        menu.append(menuItem);
    };
};