import * as path from 'node:path';
import * as fs from 'node:fs/promises';
import { ipcMain } from 'electron';
import { MainProcessError } from '$electron/error';
import type { RendererWorkerName } from '$common/enum';

export function setWorkerEvents() {
    ipcMain.handle('renderer-worker:get-js-file', async (_e, workerName: RendererWorkerName) => {
        try {
            const filePath = path.join(__dirname, `worker/web/${workerName}.js`);
            const file = await fs.readFile(filePath, 'utf8');
            if (file.length === 0) throw new MainProcessError(`${workerName}.js file is empty.`);
            return file;
            
        } catch (err) {
            MainProcessError.catch(err);
            return null;
        }
    });
}