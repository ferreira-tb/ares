import { ipcMain } from 'electron';
import { BrowserTab } from '$electron/tabs';
import { setCurrentViewNavigationEvents } from '$electron/events/tabs/navigation';

export function setTabEvents() {
    // Aba principal.
    ipcMain.handle('main-tab:id', () => BrowserTab.main.id);
    ipcMain.handle('main-tab:url', () => BrowserTab.main.getURL());
    ipcMain.on('main-tab:reload', () => BrowserTab.main.reload());
    ipcMain.on('main-tab:force-reload', () => BrowserTab.main.reloadIgnoringCache());

    // Aba atual.
    ipcMain.on('current-tab:update', (_e, tabId: number) => BrowserTab.setCurrent(tabId));
    ipcMain.handle('current-tab:id', () => BrowserTab.current.id);
    ipcMain.handle('current-tab:url', () => BrowserTab.current.getURL());
    ipcMain.handle('current-tab:can-go-back', () => BrowserTab.current.canGoBack());
    ipcMain.handle('current-tab:can-go-forward', () => BrowserTab.current.canGoForward());

    ipcMain.on('current-tab:back', () => BrowserTab.current.goBack());
    ipcMain.on('current-tab:forward', () => BrowserTab.current.goForward());
    ipcMain.on('current-tab:home', () => BrowserTab.current.goHome());
    ipcMain.on('current-tab:reload', () => BrowserTab.current.reload());
    ipcMain.on('current-tab:force-reload', () => BrowserTab.current.reloadIgnoringCache());

    // Abas específicas.
    ipcMain.on('tab:destroy', (_e, tabId: number) => BrowserTab.destroy(tabId));

    setCurrentViewNavigationEvents();
};