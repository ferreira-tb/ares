import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { browserStore } from '$electron/stores/browser.js';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers';
import type { TribalWarsGameData } from '$deimos/models/data.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    ipcMain.on('script-tag-is-ready', () => {
        const mainWindow = assertMainWindow();
        mainWindow.webContents.send('get-game-data');
    });

    ipcMain.handle('get-deimos-file', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });

    ipcMain.on('update-game-data', (_e, gameData: TribalWarsGameData) => {
        for (const [key, value] of Object.entries(gameData)) {
            browserStore[key as keyof TribalWarsGameData] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('update-game-data', gameData);
    });
};