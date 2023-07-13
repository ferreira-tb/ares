import * as fs from 'node:fs/promises';
import { ipcMain, webContents } from 'electron';
import { ipcTribalJs } from '$electron/utils/files';
import { MainProcessError } from '$electron/error';
import { useCacheStore, useGameDataStore } from '$electron/stores';

export function setIpcTribalEvents() {
    const cacheStore = useCacheStore();
    const gameDataStore = useGameDataStore();

    /** Conteúdo do arquivo `ipc-tw.js`. */
    let ipcTribal: string | null = null;

    // Indica que o script `ipc-tw.js` foi completamente carregado na aba principal.
    // Observe que os dados obtidos contêm informações que podem ser específicas da aba em questão.
    // Por exemplo, a quantidade de tropas da aldeia atual, que pode muito bem ser diferente em outra aba.
    // Por hora, isso não é um problema, mas pode se tornar no futuro, caso o script passe a ser carregado em mais de uma aba.
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
        }
    });

    // Recebe os dados do jogo, salva-os localmente e então envia-os ao painel.
    ipcMain.on('ipc-tribal:update-game-data', (e: Electron.IpcMainEvent, gameData: TribalWarsGameDataType | null) => {
        try {
            if (!gameData) {
                cacheStore.player = null;
                cacheStore.world = null;
                return;
            }

            gameDataStore.$patch(gameData);
            cacheStore.player = gameData.player.name;
            cacheStore.world = gameData.world;
            
            for (const contents of webContents.getAllWebContents()) {
                if (contents !== e.sender) {
                    contents.send('game:patch-game-data', gameData);
                }
            }

        } catch (err) {
            MainProcessError.catch(err);
        }
    });
}