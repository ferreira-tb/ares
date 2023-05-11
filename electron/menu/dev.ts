import { Menu, MenuItem, webContents } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import type { useBrowserViewStore } from '$electron/interface';

function getDevOptions(browserViewStore: ReturnType<typeof useBrowserViewStore>): Electron.MenuItemConstructorOptions[] {
    const { webContents: mainContents } = getMainWindow();
    const { webContents: panelContents } = getPanelWindow();
    const { currentWebContents: currentWebContentsMaybeNull } = storeToRefs(browserViewStore);

    const contents = computed<Electron.WebContents>([currentWebContentsMaybeNull], () => {
        return currentWebContentsMaybeNull.value ?? getMainViewWebContents();
    });

    const options: Electron.MenuItemConstructorOptions[] = [
        { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => contents.value.reloadIgnoringCache() },
        { label: 'Conjurar magia', accelerator: 'F9', click: () => castDevMagic() },
        { label: 'Inspecionar', accelerator: 'F10', click: () => contents.value.openDevTools({ mode: 'detach' }) },
        { label: 'Inspecionar janela principal', accelerator: 'F11', click: () => mainContents.openDevTools({ mode: 'detach' }) },
        { label: 'Inspecionar painel', accelerator: 'F12', click: () => panelContents.openDevTools({ mode: 'detach' }) }
    ];

    options.forEach((option) => {
        option.visible = false;
    });

    return options;
};

/** Adiciona o menu de desenvolvedor à janela. */
export function setDevMenu(browserViewStore: ReturnType<typeof useBrowserViewStore>, ...args: Electron.BrowserWindow[]) {
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

export function setModuleDevMenu(browserWindow: Electron.BrowserWindow) {
    if (process.env.ARES_MODE !== 'dev') {
        browserWindow.setMenu(null);
        return;
    };

    const contents = browserWindow.webContents;
    const options: Electron.MenuItemConstructorOptions[] = [
        { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => contents.reloadIgnoringCache() },
        { label: 'Conjurar magia', accelerator: 'F9', click: () => castDevMagic() },
        { label: 'Inspecionar', accelerator: 'CmdOrCtrl+F12', click: () => contents.openDevTools({ mode: 'detach' }) }
    ];

    options.forEach((option) => {
        option.visible = false;
    });

    const menu = Menu.buildFromTemplate(options);
    browserWindow.setMenu(menu);
};

/** Usado para situações de teste durante o desenvolvimento. */
function castDevMagic() {
    const allWebContents = webContents.getAllWebContents();
    for (const contents of allWebContents) {
        contents.send('its-dev-magic');
    };
};