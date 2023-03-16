import { ipcMain } from 'electron';
import { computed, storeToRefs } from 'mechanus';
import { useBrowserViewStore } from '$interface/index';
import { insertCSS, getMainWindow, getMainViewWebContents } from '$electron/utils/helpers';
import { gameURL } from '$electron/utils/constants';
import { isAllowedURL } from '$electron/utils/guards';
import type { WebContents } from 'electron';
import type { BackForwardStatus } from '$types/view';

export function setCurrentViewEvents() {
    const mainWindow = getMainWindow();
    const browserViewStore = useBrowserViewStore();
    const { currentWebContents } = storeToRefs(browserViewStore);

    const currentView = computed<WebContents>([currentWebContents], () => {
        if (currentWebContents.value) return currentWebContents.value;
        return getMainViewWebContents();
    });

    const backForwardStatus = (): BackForwardStatus => ({
        canGoBack: currentView.value.canGoBack(),
        canGoForward: currentView.value.canGoForward()
    });

    // Impede que o usuário navegue para fora da página do jogo.
    currentView.value.on('will-navigate', (e, url) => {
        if (!isAllowedURL(url)) e.preventDefault();
    });

    currentView.value.on('did-start-loading', () => {
        mainWindow.webContents.send('current-view-did-start-loading');
    });

    currentView.value.on('did-stop-loading', () => {
        mainWindow.webContents.send('current-view-did-stop-loading');
    });

    currentView.value.on('did-navigate', () => {
        insertCSS(currentView.value);
        mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus());
    });

    currentView.value.on('did-navigate-in-page', () => {
        mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus());
    });

    currentView.value.on('did-redirect-navigation', () => {
        mainWindow.webContents.send('current-view-back-forward-status', backForwardStatus());
    });

    ipcMain.handle('current-view-url', () => currentView.value.getURL());
    ipcMain.on('current-view-go-home', () => currentView.value.loadURL(gameURL));
    ipcMain.handle('current-view-can-go-back', () => currentView.value.canGoBack());
    ipcMain.handle('current-view-can-go-forward', () => currentView.value.canGoForward());

    ipcMain.on('current-view-go-back', () => {
        if (currentView.value.canGoBack()) {
            currentView.value.goBack();
        };
    });

    ipcMain.on('current-view-go-forward', () => {
        if (currentView.value.canGoForward()) {
            currentView.value.goForward();
        };
    });
};