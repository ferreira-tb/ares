import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';
import { browserStore } from '$electron/stores/browser.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    ipcMain.handle('get-deimos-file', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });

    ipcMain.on('update-current-world', (_e, world: string | null) => browserStore.world = world);
    ipcMain.on('update-current-major-version', (_e, version: string | null) => browserStore.version = version);
    ipcMain.on('update-current-player', (_e, player: string | null) => browserStore.player = player);
    ipcMain.on('update-current-player-id', (_e, playerId: number | null) => browserStore.playerId = playerId);
    ipcMain.on('update-current-group-id', (_e, groupId: number | null) => browserStore.groupId = groupId);
};