import { ipcMain, Menu } from 'electron';
import { getMainWindow } from '$electron/utils/helpers';
import { showErrorLog, openIssuesWebsite } from '$electron/app/modules';
import type { MenuItemConstructorOptions } from 'electron';

export function setMenuEvents() {
    const mainWindow = getMainWindow();

    ipcMain.on('open-region-select-menu', () => {
        const template: MenuItemConstructorOptions[] = [
            { label: 'Brasil', type: 'radio' },
            { label: 'Portugal', type: 'radio', enabled: false }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow });
    });

    ipcMain.on('open-bug-report-menu', () => {
        const template: MenuItemConstructorOptions[] = [
            { label: 'Registro de erros', click: () => showErrorLog() },
            { label: 'Problemas conhecidos', click: () => openIssuesWebsite() }
        ];

        const menu = Menu.buildFromTemplate(template);
        menu.popup({ window: mainWindow });
    });
};