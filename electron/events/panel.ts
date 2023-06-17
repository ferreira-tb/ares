import { ipcMain } from 'electron';
import { PanelWindow } from '$electron/windows';

export function setPanelEvents() {
    const panelWindow = PanelWindow.getInstance();

    ipcMain.handle('panel:toggle', () => panelWindow.toggle());
    ipcMain.handle('panel:is-visible', () => panelWindow.isVisible());
};