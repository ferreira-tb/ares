import { Menu } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { showAppSettings } from '$electron/modules';
import { togglePanelWindow, getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { appendDevMenu } from '$electron/menu/dev';
import { getMainViewWebContents, contentsGoBack, contentsGoForward, contentsGoHome } from '$electron/utils/view';
import type { useBrowserViewStore, useCacheStore } from '$electron/stores';

export function setAppMenu(
    browserViewStore: ReturnType<typeof useBrowserViewStore>,
    cacheStore: ReturnType<typeof useCacheStore>
) {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();
    const { currentWebContents: currentWebContentsMaybeNull } = storeToRefs(browserViewStore);

    const currentWebContents = computed<Electron.WebContents>([currentWebContentsMaybeNull], () => {
        return currentWebContentsMaybeNull.value ?? getMainViewWebContents();
    });

    const sharedOptions: Electron.MenuItemConstructorOptions[] = [
        { label: 'Início', accelerator: 'CmdOrCtrl+Home', click: () => contentsGoHome(currentWebContents.value, cacheStore.region) },
        { label: 'Atualizar', accelerator: 'F5', click: () => currentWebContents.value.reload() },
        { label: 'Voltar', accelerator: 'CmdOrCtrl+Left', click: () => contentsGoBack(currentWebContents.value) },
        { label: 'Avançar', accelerator: 'CmdOrCtrl+Right', click: () => contentsGoForward(currentWebContents.value) },

        { label: 'Focar view principal', accelerator: 'F1', click: () => mainWindow.webContents.send('focus-main-view') },
        { label: 'Exibir ou ocultar painel', accelerator: 'F2', click: () => togglePanelWindow() },
        { label: 'Configurações', accelerator: 'F3', click: () => showAppSettings('config-general') },
        
        { label: 'Sair', accelerator: 'Esc', role: 'quit' }
    ];

    sharedOptions.forEach((option) => {
        option.visible = false;
    });

    const mainMenu = Menu.buildFromTemplate([...sharedOptions]);
    const panelMenu = Menu.buildFromTemplate([...sharedOptions]);

    // Adiciona o menu de desenvolvedor às janelas.
    appendDevMenu(browserViewStore, mainMenu, panelMenu);

    mainWindow.setMenu(mainMenu);
    panelWindow.setMenu(panelMenu);
};