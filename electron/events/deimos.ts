import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { browserStore } from '$electron/stores/browser.js';
import { plunderStore } from '$electron/stores/plunder.js';
import { unitStore } from '$electron/stores/units.js';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';
import type { UnitsAmount } from '$types/game.js';

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

    ipcMain.on('update-plunder-info', (_e, plunderInfo: PlunderInfo) => {
        for (const [key, value] of Object.entries(plunderInfo)) {
            (plunderStore as any)[key] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('update-plunder-info', plunderInfo);
    });

    ipcMain.on('update-current-village-units', (_e, units: UnitsAmount) => {
        for (const [key, value] of Object.entries(units)) {
            unitStore[key as keyof UnitsAmount] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('update-current-village-units', units);
    });
};