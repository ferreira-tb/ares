import { ipcMain } from 'electron';
import { readDeimosFile } from '$electron/app/deimos.js';

export function setDeimosEvents() {
    /** Conteúdo do arquivo `deimos.js`. */
    let deimos: string | null = null;

    ipcMain.handle('get-deimos', async () => {
        deimos ??= await readDeimosFile();
        return deimos;
    });
};