import { ipcMain } from 'electron';
import { URL } from 'node:url';
import { createPhobos } from '../phobos.js';
import { assert, assertType, MainProcessError } from '../error.js';
import { getDeimosPort, isDeimosOn } from '../deimos.js';
import { assertCurrentWorld } from '../helpers.js';
import type { BrowserWindow } from 'electron';

/** Contêm as URLs dos relatórios que serão usados pelo Deimos. */
const deimosReportURLs = new Set<string>();

export function setDeimosEvents(mainWindow: BrowserWindow) {
    ipcMain.handle('is-deimos-on', async () => await isDeimosOn());

    ipcMain.handle('deimos-port', (_e, asInt: boolean) => {
        if (asInt !== true) return getDeimosPort();
        return getDeimosPort(true);
    });

    ipcMain.handle('deimos-base-endpoint', () => {
        const port = getDeimosPort();
        return `http://127.0.0.1:${port}/deimos`;
    });

    ipcMain.handle('can-predict-plunder', async (_e, world?: string) => {
        try {
            const port = getDeimosPort();
            if (typeof world !== 'string') world = assertCurrentWorld(mainWindow);
            const response = await fetch(`http://127.0.0.1:${port}/deimos/plunder/predict/${world}`);

            assert(response.ok, `Não foi possível determinar se o Deimos é capaz de fazer previsões no mundo ${world}`);
            const isReady = await response.json() as boolean;
            return isReady;

        } catch (err) {
            if (err instanceof TypeError || err instanceof MainProcessError) {
                MainProcessError.handle(err);
            };
            
            return false;
        };
    });

    ipcMain.on('add-deimos-report-url', async (_e, url: string) => {
        try {
            assertType(typeof url === 'string', 'A URL do relatório é inválida');
            deimosReportURLs.add(url);
    
            if (deimosReportURLs.size >= 100) {
                const urlObject = new URL(url);
                const phobos = await createPhobos('deimos-report', urlObject, mainWindow);
                phobos.webContents.send('fetch-deimos-report-url', Array.from(deimosReportURLs));
                deimosReportURLs.clear();
            };

        } catch (err) {
            MainProcessError.handle(err);
        };
    });
};