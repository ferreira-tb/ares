import { ipcMain } from 'electron';
import { assertInteger } from '@tb-dev/ts-guard';
import { MainProcessError } from '$electron/error.js';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import { browserStore } from '$electron/stores/browser.js';
import { worldStore, setIntoWorldStore } from '$electron/electron-store/world.js';

export function setBrowserEvents() {
    const mainWindow = assertMainWindow();
    const panelWindow = assertPanelWindow();

    ipcMain.on('reload-browser-window', () => mainWindow.webContents.reload());
    ipcMain.on('force-reload-browser-window', () => mainWindow.webContents.reloadIgnoringCache());

    // Recebe as coordenadas da janela do browser e então as envia para o painel.
    ipcMain.on('update-current-coords', (_e, currentX: unknown, currentY: unknown) => {
        try {
            assertInteger(currentX, 'A coordenada X é inválida.');
            assertInteger(currentY, 'A coordenada Y é inválida.');
            panelWindow.webContents.send('update-current-coords', currentX, currentY);
        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    // Retorna o mundo atual.
    ipcMain.handle('get-current-world', () => browserStore.world);
    // Indica se as configurações do mundo ou das unidades estão salvas no armazenamento.
    ipcMain.handle('has-world-data', (_e, world: string) => worldStore.has(`world-info.${world}`));
    ipcMain.handle('has-unit-data', (_e, world: string) => worldStore.has(`unit-info.${world}`));

    // Salvas as configurações no armazenamento.
    ipcMain.handle('set-world-data', (_e, world: string, data: unknown) => {
        return setIntoWorldStore(`world-info.${world}`, data);
    });

    ipcMain.handle('set-unit-data', (_e, world: string, data: unknown) => {
        return setIntoWorldStore(`unit-info.${world}`, data);
    });
};