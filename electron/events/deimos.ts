import { ipcMain } from 'electron';
import { URL } from 'node:url';
import { createPhobos } from '../phobos.js';
import { assertType } from '../error.js';
import type { BrowserWindow } from 'electron';

/** Contêm as URLs dos relatórios que serão usados pelo Deimos. */
const deimosReportURLs = new Set<string>();

export function setDeimosEvents(mainWindow: BrowserWindow) {
    ipcMain.on('add-deimos-report-url', async (_e, url: string) => {
        assertType(typeof url === 'string', 'A URL do relatório é inválida');
        deimosReportURLs.add(url);

        if (deimosReportURLs.size >= 100) {
            const urlObject = new URL(url);
            const phobos = await createPhobos('deimos-report', urlObject, mainWindow);
            phobos.webContents.send('fetch-deimos-report-url', Array.from(deimosReportURLs));
            deimosReportURLs.clear();
        };
    });
};