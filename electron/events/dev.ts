import { ipcMain } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers';
import { getMainViewWebContents } from '$electron/utils/view';
import { useBrowserViewStore } from '$electron/interface';
import type { WebContents } from 'electron';

export function setDevEvents() {
    if (process.env.ARES_MODE !== 'dev') return;

    const browserViewStore = useBrowserViewStore();
    const { webContents: mainContents } = getMainWindow();
    const { webContents: panelContents } = getPanelWindow();
    const { currentWebContents: currentWebContentsMaybeNull } = storeToRefs(browserViewStore);

    const contents = computed<WebContents>([currentWebContentsMaybeNull], () => {
        return currentWebContentsMaybeNull.value ?? getMainViewWebContents();
    });

    ipcMain.on('dev:open-main-window-dev-tools', () => {
        mainContents.openDevTools({ mode: 'detach' });
    });

    ipcMain.on('dev:open-current-view-dev-tools', () => {
        contents.value.openDevTools({ mode: 'detach' });
    });

    ipcMain.on('dev:open-main-view-dev-tools', () => {
        getMainViewWebContents().openDevTools({ mode: 'detach' });
    });

    ipcMain.on('dev:open-panel-window-dev-tools', () => {
        panelContents.openDevTools({ mode: 'detach' });
    });
};