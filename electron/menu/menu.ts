import { Menu } from 'electron';
import { MainWindow, PanelWindow, StandardWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { appendDevMenu } from '$electron/menu/dev';
import { StandardWindowName } from '$common/constants';

export function setMenu() {
    const mainWindow = MainWindow.getInstance();
    const panelWindow = PanelWindow.getInstance();

    const sharedOptions: Electron.MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => BrowserTab.current.goHome() },
        { label: 'Atualizar', accelerator: 'F5', click: () => BrowserTab.current.reload() },
        { label: 'Voltar', accelerator: 'CmdOrCtrl+Left', click: () => BrowserTab.current.goBack() },
        { label: 'Avançar', accelerator: 'CmdOrCtrl+Right', click: () => BrowserTab.current.goForward() },

        { label: 'Focar view principal', accelerator: 'F1', click: () => mainWindow.webContents.send('main-tab:focus') },
        { label: 'Exibir ou ocultar painel', accelerator: 'F2', click: () => panelWindow.toggle() },
        { label: 'Configurações', accelerator: 'F3', click: () => void StandardWindow.open(StandardWindowName.Config) },
        
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];

    sharedOptions.forEach((option) => {
        option.visible = false;
    });

    const mainMenu = Menu.buildFromTemplate([...sharedOptions]);
    const panelMenu = Menu.buildFromTemplate([...sharedOptions]);

    // Adiciona o menu de desenvolvedor às janelas.
    appendDevMenu(mainMenu, panelMenu);

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};