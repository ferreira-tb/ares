import { Menu, MenuItem, webContents } from 'electron';
import { MainWindow, PanelWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import type { BaseWindow, StandardWindow, WebsiteWindow } from '$electron/windows';

function getDevOptions(): Electron.MenuItemConstructorOptions[] {
    const mainWindow = MainWindow.getInstance();
    const panelWindow = PanelWindow.getInstance();

    const options: Electron.MenuItemConstructorOptions[] = [
        { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => mainWindow.webContents.reloadIgnoringCache() },
        { label: 'Conjurar magia', accelerator: 'F9', click: () => castDevMagic() },
        { label: 'Inspecionar', accelerator: 'F10', click: () => BrowserTab.current.openDevTools() },
        { label: 'Inspecionar janela principal', accelerator: 'F11', click: () => mainWindow.openDevTools() },
        { label: 'Inspecionar painel', accelerator: 'F12', click: () => panelWindow.openDevTools() }
    ];

    options.forEach((option) => (option.visible = false));
    return options;
};

/** Adiciona o menu de desenvolvedor à janela principal ou ao painel. */
export function setDevMenu(...args: BaseWindow[]) {
    const options = getDevOptions();
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
export function appendDevMenu(...args: Menu[]) {
    if (process.env.ARES_MODE !== 'dev') return;
    
    const options = getDevOptions();
    for (const menu of args) {
        const menuItem = new MenuItem({ label: 'Desenvolvedor', submenu: options });
        menu.append(menuItem);
    };
};

export function setWindowDevMenu(standardWindow: StandardWindow | WebsiteWindow) {
    if (process.env.ARES_MODE !== 'dev') {
        standardWindow.setMenu(null);
        return;
    };

    const options: Electron.MenuItemConstructorOptions[] = [
        { label: 'Forçar atualização', accelerator: 'CmdOrCtrl+F5', click: () => standardWindow.webContents.reloadIgnoringCache() },
        { label: 'Conjurar magia', accelerator: 'F9', click: () => castDevMagic() },
        { label: 'Inspecionar', accelerator: 'CmdOrCtrl+F12', click: () => standardWindow.webContents.openDevTools() }
    ];

    options.forEach((option) => (option.visible = false));

    const menu = Menu.buildFromTemplate(options);
    standardWindow.setMenu(menu);
};

/** Usado para situações de teste durante o desenvolvimento. */
function castDevMagic() {
    const allWebContents = webContents.getAllWebContents();
    for (const contents of allWebContents) {
        contents.send('dev:magic');
    };
};