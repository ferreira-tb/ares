import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos';
import { getPanelWindow } from '$electron/utils/helpers';
import { ProxyStoreError } from '$electron/error';
import type { PlunderInfoType } from '$types/plunder';
import type { UnitAmount, TribalWarsGameDataType } from '$types/game';

import {
    useAresStore,
    usePlayerStore,
    useUnitsStore,
    useFeaturesStore,
    usePlunderStore,
    useCurrentVillageStore,
    useCacheStore,
    useGroupsStore
} from '$interface/index';

export function setDeimosEvents() {
    const aresStore = useAresStore();
    const playerStore = usePlayerStore();
    const unitsStore = useUnitsStore();
    const featuresStore = useFeaturesStore();
    const plunderStore = usePlunderStore();
    const currentVillageStore = useCurrentVillageStore();
    const groupsStore = useGroupsStore();
    const cacheStore = useCacheStore();

    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    // Indica que o script `deimos.js` foi completamente carregado na view.
    ipcMain.on('deimos-tag-is-ready', (e) => e.sender.send('get-game-data'));

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
                            if (aresKey === 'world') Reflect.set(cacheStore, 'world', aresValue);
                            Reflect.set(aresStore, aresKey, aresValue);
                        };
                        break;
                    case 'features':
                        for (const [featureKey, featureValue] of Object.entries(value)) {
                            Reflect.set(featuresStore, featureKey, featureValue);
                        };
                        break;
                    case 'groups':
                        for (const [groupKey, groupValue] of Object.entries(value)) {
                            Reflect.set(groupsStore, groupKey, groupValue);
                        };
                        break;
                    case 'player':
                        for (const [playerKey, playerValue] of Object.entries(value)) {
                            if (playerKey === 'name') Reflect.set(cacheStore, 'player', playerValue);
                            Reflect.set(playerStore, playerKey, playerValue);
                        };
                        break;
                    case 'currentVillage':
                        for (const [villageKey, villageValue] of Object.entries(value)) {
                            Reflect.set(currentVillageStore, villageKey, villageValue);
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
                Reflect.set(plunderStore, key, value);
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
            for (const [key, value] of Object.entries(units) as [keyof UnitAmount, number][]) {
                unitsStore[key] = value;
            };
    
            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('patch-panel-current-village-units', units);

        } catch (err) {
            ProxyStoreError.catch(err);
        };
    });
};