import { ipcMain } from 'electron';
import { MainWindow, PanelWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { setDebugEvents } from '$electron/events/dev/debug';

export function setDevEvents() {
    const mainWindow = MainWindow.getInstance();
    const panelWindow = PanelWindow.getInstance();

    ipcMain.on('dev-tools:main-window', () => mainWindow.openDevTools());
    ipcMain.on('dev-tools:panel-window', () => panelWindow.openDevTools());
    ipcMain.on('dev-tools:current-tab', () => BrowserTab.current.openDevTools());
    ipcMain.on('dev-tools:main-tab', () => BrowserTab.main.openDevTools());

    setDebugEvents();
};