import { ipcMain } from 'electron';
import { URL } from 'node:url';
import { assert, assertInteger, assertType, MainProcessError } from '../error.js';
import { getWorldFromURL } from '../helpers.js';
import { getDeimosPort } from '../main.js';
import type { ErrorLog, DOMErrorLog } from '#/types.js';
import type { ErrorLogForDeimos, DOMErrorLogForDeimos } from '../types.js';

export function setErrorEvents() {
    ipcMain.on('log-error', async (_e, err: ErrorLog) => {
        try {
            assertType(typeof err.name === 'string', 'O nome do erro é inválido.');
            assertType(typeof err.message === 'string', 'Não há uma mensagem válida no relatório de erro.');
            assertInteger(err.time, 'A hora informada no relatório de erro é inválida.');
    
            const errorLog: ErrorLogForDeimos = {
                name: err.name,
                message: err.message,
                time: err.time,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            };
    
            const port = getDeimosPort().toString(10);
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

            const errorLog: DOMErrorLogForDeimos = {
                url: url.href,
                world: world,
                selector: err.selector,
                time: err.time,
                chrome: process.versions.chrome,
                electron: process.versions.electron
            };

            const port = getDeimosPort().toString(10);
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
