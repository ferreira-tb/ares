import * as fs from 'node:fs/promises';
import { ipcMain } from 'electron';
import { getPanelWindow } from '$electron/utils/helpers';
import { ipcTribalJs } from '$electron/utils/files';
import { MainProcessEventError } from '$electron/error';

import {
    useAresStore,
    usePlayerStore,
    useUnitsStore,
    useFeaturesStore,
    usePlunderStore,
    useCurrentVillageStore,
    useCacheStore,
    useGroupsStore
} from '$electron/interface';

export function setIpcTribalEvents() {
    const aresStore = useAresStore();
    const playerStore = usePlayerStore();
    const unitsStore = useUnitsStore();
    const featuresStore = useFeaturesStore();
    const plunderStore = usePlunderStore();
    const currentVillageStore = useCurrentVillageStore();
    const groupsStore = useGroupsStore();

    /** Conteúdo do arquivo `ipc-tw.js`. */
    let ipcTribal: string | null = null;

    // Indica que o script `ipc-tw.js` foi completamente carregado na view.
    ipcMain.on('ipc-tribal:tag-is-ready', (e) => e.sender.send('get-game-data'));

    // Retorna o conteúdo do arquivo `ipc-tw.js`.
    ipcMain.handle('ipc-tribal:get-file', async (): Promise<string | null> => {
        try {
            if (ipcTribal) return ipcTribal;
            const ipcTribalFileContent = await fs.readFile(ipcTribalJs, 'utf8');
            if (ipcTribalFileContent.length === 0) throw new MainProcessEventError('ipc-tw.js file is empty.');
            ipcTribal ??= ipcTribalFileContent;
            return ipcTribal;

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    // Recebe os dados do jogo, salva-os localmente e então envia-os ao painel.
    ipcMain.on('ipc-tribal:update-game-data', <T extends keyof TribalWarsGameDataType>(
        _e: Electron.IpcMainEvent, gameData: TribalWarsGameDataType
    ) => {
        try {
            for (const key of Object.keys(gameData) as T[]) {
                switch (key) {
                    case 'ares':
                        patchGameData('ares', aresStore, gameData);
                        break;
                    case 'features':
                        patchGameData('features', featuresStore, gameData);
                        break;
                    case 'player':
                        patchGameData('player', playerStore, gameData);
                        break;
                    case 'currentVillage':
                        patchGameData('currentVillage', currentVillageStore, gameData);
                        break;
                    case 'groups':
                        patchGameData('groups', groupsStore, gameData);
                        break;
                    default:
                        throw new MainProcessEventError(`Could not update game data: ${key} is not a valid key.`);
                };
            };

            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('panel:patch-game-data', gameData);

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Recebe as informações referentes ao assistente de saque, salva-as localmente e então envia-as ao painel.
    ipcMain.handle('ipc-tribal:update-plunder-info', <T extends keyof typeof plunderStore>(
        _e: Electron.IpcMainEvent, plunderInfo: PlunderInfoType
    ) => {
        try {
            for (const [key, value] of Object.entries(plunderInfo) as [T, typeof plunderStore[T]][]) {
                plunderStore[key] = value;
            };
    
            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('panel:patch-plunder-info', plunderInfo);
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    // Recebe as informações referentes às unidades da aldeia atual, salva-as localmente e então envia-as ao painel.
    ipcMain.handle('ipc-tribal:update-current-village-units', <T extends keyof typeof unitsStore>(
        _e: Electron.IpcMainEvent, units: UnitAmount
    ) => {
        try {
            for (const [key, value] of Object.entries(units) as [T, typeof unitsStore[T]][]) {
                unitsStore[key] = value;
            };
    
            const panelWindow = getPanelWindow();
            panelWindow.webContents.send('panel:patch-current-village-units', units);
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};

function patchGameData(dataType: 'ares', store: ReturnType<typeof useAresStore>, gameData: TribalWarsGameDataType): void;
function patchGameData(dataType: 'features', store: ReturnType<typeof useFeaturesStore>, gameData: TribalWarsGameDataType): void;
function patchGameData(dataType: 'groups', store: ReturnType<typeof useGroupsStore>, gameData: TribalWarsGameDataType): void;
function patchGameData(dataType: 'player', store: ReturnType<typeof usePlayerStore>, gameData: TribalWarsGameDataType): void;
function patchGameData(dataType: 'currentVillage', store: ReturnType<typeof useCurrentVillageStore>, gameData: TribalWarsGameDataType): void;
function patchGameData<T extends keyof TribalWarsGameDataType, U extends keyof TribalWarsGameDataType[T]>(
    dataType: T, store: MechanusStore<TribalWarsGameDataType[T]>, gameData: TribalWarsGameDataType
) {
    const cacheStore = useCacheStore();
    for (const [key, value] of Object.entries(gameData[dataType]) as [U, typeof store[U]][]) {
        if (key === 'world' && dataType === 'ares') cacheStore.world = value as World | null;
        if (key === 'name' && dataType === 'player') cacheStore.player = value as string | null;
        store[key] = value;
    };
};