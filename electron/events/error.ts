import { app, ipcMain } from 'electron';
import { URL } from 'node:url';
import { assert, assertInteger, assertType, MainProcessError } from '../error.js';
import { getWorldFromURL, getDeimosPort } from '../helpers.js';
import type { ErrorLog, DOMErrorLog } from '@/error.js';
import type { ErrorLogRequest, DOMErrorLogRequest } from '@/electron.js';

export function setErrorEvents() {
    ipcMain.on('log-error', async (_e, err: ErrorLog) => {
        try {
            assertType(typeof err.name === 'string', 'O nome do erro é inválido.');
            assertType(typeof err.message === 'string', 'Não há uma mensagem válida no relatório de erro.');
            assertInteger(err.time, 'A hora informada no relatório de erro é inválida.');
    
            const errorLog: ErrorLogRequest = {
                name: err.name,
                message: err.message,
                time: err.time,
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron
            };
    
            const port = getDeimosPort(true);
            const response = await fetch(`http://127.0.0.1:${port}/deimos/error/normal`, {
                method: 'post',
                body: JSON.stringify(errorLog)
            });
    
            assert(response.ok, await response.text());

        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    ipcMain.on('log-dom-error', async (e, err: DOMErrorLog) => {
        try {
            assertType(typeof err.selector === 'string', 'O seletor informado no relatório de erro é inválido.');
            assertInteger(err.time, 'A hora informada no relatório de erro é inválida.');

            const url = new URL(e.sender.getURL());
            const world = getWorldFromURL(url);

            const errorLog: DOMErrorLogRequest = {
                url: url.href,
                world: world,
                selector: err.selector,
                time: err.time,
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron
            };

            const port = getDeimosPort(true);
            const response = await fetch(`http://127.0.0.1:${port}/deimos/error/dom`, {
                method: 'post',
                body: JSON.stringify(errorLog)
            });

            assert(response.ok, await response.text());

        } catch (err) {
            MainProcessError.handle(err);
        }; 
    });
};
