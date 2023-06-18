import * as fs from 'node:fs/promises';
import { ipcMain, webContents } from 'electron';
import { PanelWindow } from '$electron/windows';
import { ipcTribalJs } from '$electron/utils/files';
import { MainProcessError } from '$electron/error';
import {
    useCacheStore,
    useGameDataStore,
    usePlunderStore,
    useUnitsStore
} from '$electron/stores';

export function setIpcTribalEvents() {
    const cacheStore = useCacheStore();
    const gameDataStore = useGameDataStore();
    const plunderStore = usePlunderStore();
    const unitsStore = useUnitsStore();

    /** Conteúdo do arquivo `ipc-tw.js`. */
    let ipcTribal: string | null = null;

    // Indica que o script `ipc-tw.js` foi completamente carregado na view.
    ipcMain.on('ipc-tribal:tag-is-ready', (e) => e.sender.send('get-game-data'));

    // Retorna o conteúdo do arquivo `ipc-tw.js`.
    ipcMain.handle('ipc-tribal:get-file', async (): Promise<string | null> => {
        try {
            if (ipcTribal) return ipcTribal;
            const ipcTribalFileContent = await fs.readFile(ipcTribalJs, 'utf8');
            if (ipcTribalFileContent.length === 0) throw new MainProcessError('ipc-tw.js file is empty.');
            ipcTribal ??= ipcTribalFileContent;
            return ipcTribal;

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });

    // Recebe os dados do jogo, salva-os localmente e então envia-os ao painel.
    ipcMain.on('ipc-tribal:update-game-data', (e: Electron.IpcMainEvent, gameData: TribalWarsGameDataType | null) => {
        try {
            if (!gameData) {
                cacheStore.player = null;
                cacheStore.world = null;
                return;
            };

            gameDataStore.$patch(gameData);
            cacheStore.player = gameData.player.name;
            cacheStore.world = gameData.world;
            
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('game:patch-game-data', gameData);
                };
            };

        } catch (err) {
            MainProcessError.catch(err);
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
    
            const panelWindow = PanelWindow.getInstance();
            panelWindow.webContents.send('plunder:patch-info', plunderInfo);
            return true;

        } catch (err) {
            MainProcessError.catch(err);
            return false;
        };
    });

    // Recebe as informações referentes às unidades da aldeia atual, salva-as localmente e então envia-as ao painel.
    ipcMain.handle('ipc-tribal:update-current-village-units', <T extends keyof typeof unitsStore>(
        e: Electron.IpcMainEvent, units: UnitAmount
    ) => {
        try {
            for (const [key, value] of Object.entries(units) as [T, typeof unitsStore[T]][]) {
                unitsStore[key] = value;
            };
    
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('game:patch-village-units', units);
                };
            };

            return true;

        } catch (err) {
            MainProcessError.catch(err);
            return false;
        };
    });
};