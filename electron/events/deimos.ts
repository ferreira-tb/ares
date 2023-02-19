import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { browserStore, plunderStore, unitStore } from '$interface/interface.js';
import { assertMainWindow, assertPanelWindow } from '$electron/utils/helpers.js';
import type { TribalWarsGameDataType, PlunderInfoType } from '$types/deimos.js';
import type { UnitAmount } from '$types/game.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    // Indica que o script `deimos.js` foi completamente carregado no browser.
    ipcMain.on('script-tag-is-ready', () => {
        const mainWindow = assertMainWindow();
        mainWindow.webContents.send('get-game-data');
    });

    // Retorna o conteúdo do arquivo `deimos.js`.
    ipcMain.handle('get-deimos-file', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });

    // Recebe os dados do jogo, salva-os localmente e então envia-os ao painel.
    ipcMain.on('update-game-data', (_e, gameData: TribalWarsGameDataType) => {
        for (const [key, value] of Object.entries(gameData)) {
            browserStore[key as keyof TribalWarsGameDataType] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('patch-panel-game-data', gameData);
    });

    // Recebe as informações referentes ao assistente de saque, salva-as localmente e então envia-as ao painel.
    ipcMain.on('update-plunder-info', (_e, plunderInfo: PlunderInfoType) => {
        for (const [key, value] of Object.entries(plunderInfo)) {
            (plunderStore as any)[key] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('patch-panel-plunder-info', plunderInfo);
    });

    // Recebe as informações referentes às unidades da aldeia atual, salva-as localmente e então envia-as ao painel.
    ipcMain.on('update-current-village-units', (_e, units: UnitAmount) => {
        for (const [key, value] of Object.entries(units)) {
            unitStore[key as keyof UnitAmount] = value;
        };

        const panelWindow = assertPanelWindow();
        panelWindow.webContents.send('patch-panel-current-village-units', units);
    });
};