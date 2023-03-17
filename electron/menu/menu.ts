import { Menu } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { useBrowserViewStore } from '$interface/index';
import { showAppSettings } from '$electron/app/modules';
import { togglePanelWindow, getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { setBrowserDevMenu, setPanelDevMenu } from '$electron/menu/dev';
import { getMainViewWebContents, contentsGoBack, contentsGoForward, contentsGoHome } from '$electron/utils/view';
import type { MenuItemConstructorOptions, WebContents } from 'electron';

// F1 - DevTools (apenas dev).
// F2 - Exibe ou oculta o painel.
// F3 - Configurações.
// F5 - Atualiza a página.

export function setAppMenu() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    const browserViewStore = useBrowserViewStore();
    const { currentWebContents: currentWebContentsMaybeNull } = storeToRefs(browserViewStore);

    const currentWebContents = computed<WebContents>([currentWebContentsMaybeNull], () => {
        return currentWebContentsMaybeNull.value ?? getMainViewWebContents();
    });

    const sharedOptions: MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => contentsGoHome(currentWebContents.value) },
        { label: 'Atualizar', accelerator: 'F5', click: () => currentWebContents.value.reload() },
        { label: 'Voltar', accelerator: 'CmdOrCtrl+Left', click: () => contentsGoBack(currentWebContents.value) },
        { label: 'Avançar', accelerator: 'CmdOrCtrl+Right', click: () => contentsGoForward(currentWebContents.value) },

        { label: 'Exibir ou ocultar painel', accelerator: 'F2', click: () => togglePanelWindow() },
        { label: 'Configurações', accelerator: 'F3', click: () => showAppSettings('general-config') },
        
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];

    sharedOptions.forEach((option) => option.visible = false);

    const mainMenu = Menu.buildFromTemplate([...sharedOptions]);
    const panelMenu = Menu.buildFromTemplate([...sharedOptions]);

    // Adiciona o menu de desenvolvedor às janelas.
    setBrowserDevMenu(mainMenu);
    setPanelDevMenu(panelMenu);

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};