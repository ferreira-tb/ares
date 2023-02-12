import { app, ipcMain } from 'electron';
import { URL } from 'url';
import { Op } from '@sequelize/core';
import { assertType, MainProcessError } from '$electron/error.js';
import { getWorldFromURL } from '$electron/helpers.js';
import { ErrorLog, DOMErrorLog } from '$tables/error.js';

export function setErrorEvents() {
    ipcMain.on('set-error-log', async (_e, err: ErrorLog) => {
        try {
            assertType(typeof err.name === 'string', 'O nome do erro é inválido.');
            assertType(typeof err.message === 'string', 'Não há uma mensagem válida no relatório de erro.');
    
            await ErrorLog.create({
                name: err.name,
                message: err.message,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron
            });

        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    ipcMain.handle('get-error-log', async () => {
        try {
            // Elimina do registro os erros que tenham mais de 30 dias.
            const expiration = Date.now() - 2592000;
            await ErrorLog.destroy({ where: { time: { [Op.lte]: expiration } } });
            return await ErrorLog.findAll();

        } catch (err) {
            MainProcessError.handle(err);
            return null;
        };
    });

    ipcMain.on('set-dom-error-log', async (e, err: DOMErrorLog) => {
        try {
            assertType(typeof err.selector === 'string', 'O seletor informado no relatório de erro é inválido.');

            const url = new URL(e.sender.getURL());
            const world = getWorldFromURL(url);

            await DOMErrorLog.create({
                url: url.href,
                world: world,
                selector: err.selector,
                time: Date.now(),
                ares: app.getVersion(),
                chrome: process.versions.chrome,
                electron: process.versions.electron
            });

        } catch (err) {
            MainProcessError.handle(err);
        }; 
    });

    ipcMain.handle('get-dom-error-log', async () => {
        try {
            // Elimina do registro os erros que tenham mais de 30 dias.
            const expiration = Date.now() - 2592000;
            await DOMErrorLog.destroy({ where: { time: { [Op.lte]: expiration } } });
            return await DOMErrorLog.findAll();
            
        } catch (err) {
            MainProcessError.handle(err);
            return null;
        };
    });
};