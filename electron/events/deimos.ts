import { ipcMain } from 'electron';
import { URL } from 'node:url';
import { createPhobos } from '$electron/ares/phobos.js';
import { assert, assertInteger, assertType, MainProcessError } from '$electron/error.js';
import { getDeimosPort, getDeimosEndpoint, isDeimosOn } from '$electron/ares/deimos.js';
import { assertCurrentWorld } from '$electron/helpers.js';
import type { BrowserWindow } from 'electron';
import type { PhobosOptions } from '$types/electron.js';
import type { DeimosReportInfo } from '$types/deimos.js';

/** Contêm as URLs dos relatórios que serão usados pelo Deimos. */
const plunderReportURLs = new Set<string>();

export function setDeimosEvents(mainWindow: BrowserWindow) {
    ipcMain.handle('is-deimos-on', async () => await isDeimosOn());

    ipcMain.handle('deimos-port', (_e, asInt: boolean) => {
        if (asInt !== true) return getDeimosPort();
        return getDeimosPort(true);
    });

    ipcMain.handle('deimos-endpoint', () => getDeimosEndpoint());

    ipcMain.handle('can-predict-plunder', async (_e, world?: string) => {
        try {
            if (typeof world !== 'string') world = assertCurrentWorld(mainWindow);
            const response = await fetch(`${getDeimosEndpoint()}/plunder/predict/${world}`);

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
            plunderReportURLs.add(url);

            if (plunderReportURLs.size >= 80) {
                const urlObject = new URL(url);
                const options: PhobosOptions = { override: false };
                const phobos = await createPhobos('deimos-plunder-report', urlObject, mainWindow, options);
                phobos.webContents.send('fetch-deimos-report-url', Array.from(plunderReportURLs));
                plunderReportURLs.clear();
            };

        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    ipcMain.handle('deimos-report-exists', async (_e, reportInfo: DeimosReportInfo) => {
        try {
            assertType(typeof reportInfo.world === 'string', 'O nome do mundo é inválido');
            assertInteger(reportInfo.report_id, 'O ID do relatório é inválido');

            const response = await fetch(`${getDeimosEndpoint()}/plunder/verify`, {
                method: 'post',
                body: JSON.stringify(reportInfo)
            });

            assert(response.ok, 'Não foi possível verificar se o relatório existe no Deimos');
            const exists = await response.json() as unknown;
            assertType(typeof exists === 'boolean', 'O Deimos respondeu com um valor inválido');
            return exists;

        } catch (err) {
            MainProcessError.handle(err);
            return false;
        };
    });
};