import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { getMainWindow, getPanelWindow } from '$electron/utils/helpers.js';
import { ProxyStoreError } from '$electron/error.js';
import type { PlunderInfoType } from '$types/plunder.js';
import type { UnitAmount, TribalWarsGameDataType } from '$types/game.js';

import {
    aresProxy,
    plunderProxy,
    unitProxy,
    featuresProxy,
    playerProxy,
    currentVillageProxy,
    cacheProxy
} from '$interface/index.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    // Indica que o script `deimos.js` foi completamente carregado no browser.
    ipcMain.on('script-tag-is-ready', () => {
        const mainWindow = getMainWindow();
        mainWindow.webContents.send('get-game-data');
    });

    // Retorna o conteúdo do arquivo `deimos.js`.
    ipcMain.handle('get-deimos-file', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });

    // Recebe os dados do jogo, salva-os localmente e então envia-os ao painel.
    ipcMain.on('update-game-data', (_e, gameData: TribalWarsGameDataType) => {
        try {
            type GameDataKeys = keyof TribalWarsGameDataType;
            type GameDataValues = TribalWarsGameDataType[GameDataKeys];
            
            for (const [key, value] of Object.entries(gameData) as [GameDataKeys, GameDataValues][]) {
                switch (key) {
                    case 'ares':
                        for (const [aresKey, aresValue] of Object.entries(value)) {
                            if (aresKey === 'world') Reflect.set(cacheProxy, 'world', aresValue);
                            Reflect.set(aresProxy, aresKey, aresValue);
                        };
                        break;
                    case 'features':
                        for (const [featureKey, featureValue] of Object.entries(value)) {
                            Reflect.set(featuresProxy, featureKey, featureValue);
                        };
                        break;
                    case 'player':
                        for (const [playerKey, playerValue] of Object.entries(value)) {
                            if (playerKey === 'name') Reflect.set(cacheProxy, 'player', playerValue);
                            Reflect.set(playerProxy, playerKey, playerValue);
                        };
                        break;
                    case 'currentVillage':
                        for (const [villageKey, villageValue] of Object.entries(value)) {
                            Reflect.set(currentVillageProxy, villageKey, villageValue);
                        };
                        break;
                    default:
                        throw new ProxyStoreError(`A chave "${key}" não é válida para o objeto \"gameData\".`);
                };
            };

            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('patch-panel-game-data', gameData);

        } catch (err) {
            ProxyStoreError.catch(err);
        };
    });

    // Recebe as informações referentes ao assistente de saque, salva-as localmente e então envia-as ao painel.
    ipcMain.on('update-plunder-info', (_e, plunderInfo: PlunderInfoType) => {
        try {
            for (const [key, value] of Object.entries(plunderInfo)) {
                Reflect.set(plunderProxy, key, value);
            };
    
            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('patch-panel-plunder-info', plunderInfo);

        } catch (err) {
            ProxyStoreError.catch(err);
        };
    });

    // Recebe as informações referentes às unidades da aldeia atual, salva-as localmente e então envia-as ao painel.
    ipcMain.on('update-current-village-units', (_e, units: UnitAmount) => {
        try {
            for (const [key, value] of Object.entries(units)) {
                Reflect.set(unitProxy, key, value);
            };
    
            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('patch-panel-current-village-units', units);

        } catch (err) {
            ProxyStoreError.catch(err);
        };
    });
};