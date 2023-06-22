import { ipcMain } from 'electron';
import { MainWindow, StandardWindow } from '$electron/windows';
import { BrowserTab } from '$electron/tabs';
import { setDebugEvents } from '$electron/events/dev/debug';
import { StandardWindowName } from '$common/enum';

export function setDevEvents() {
    const mainWindow = MainWindow.getInstance();

    ipcMain.on('dev-tools:main-window', () => mainWindow.openDevTools());
    ipcMain.on('dev-tools:current-tab', () => BrowserTab.current.openDevTools());
    ipcMain.on('dev-tools:main-tab', () => BrowserTab.main.openDevTools());

    ipcMain.on('dev:magic', () => {
        StandardWindow.open(StandardWindowName.GroupTemplate);
    });

    setDebugEvents();
}