import { app, ipcMain } from 'electron';
import { URL } from 'url';
import { Op } from 'sequelize';
import { assertType, MainProcessError } from '$electron/error.js';
import { getWorldFromURL } from '$electron/helpers.js';
import { sequelize } from '$electron/database/database.js';
import { ErrorLog, DOMErrorLog } from '$tables/error.js';

export function setErrorEvents() {
    ipcMain.on('set-error-log', async (_e, err: ErrorLog) => {
        try {
            assertType(typeof err.name === 'string', 'O nome do erro é inválido.');
            assertType(typeof err.message === 'string', 'Não há uma mensagem válida no relatório de erro.');
    
            await sequelize.transaction(async (transaction) => {
                await ErrorLog.create({
                    name: err.name,
                    message: err.message,
                    time: Date.now(),
                    ares: app.getVersion(),
                    chrome: process.versions.chrome,
                    electron: process.versions.electron
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    ipcMain.handle('get-error-log', async () => {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.now() - 2592000;
                await ErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
                return await ErrorLog.findAll({ raw: true, transaction });
            });
            
            return result;

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

            await sequelize.transaction(async (transaction) => {
                await DOMErrorLog.create({
                    url: url.href,
                    world: world,
                    selector: err.selector,
                    time: Date.now(),
                    ares: app.getVersion(),
                    chrome: process.versions.chrome,
                    electron: process.versions.electron
                }, { transaction });
            });

        } catch (err) {
            MainProcessError.handle(err);
        }; 
    });

    ipcMain.handle('get-dom-error-log', async () => {
        try {
            const result = await sequelize.transaction(async (transaction) => {
                // Elimina do registro os erros que tenham mais de 30 dias.
                const expiration = Date.now() - 2592000;
                await DOMErrorLog.destroy({ where: { time: { [Op.lte]: expiration } }, transaction });
                return await DOMErrorLog.findAll({ raw: true, transaction });
            });
            
            return result;

        } catch (err) {
            MainProcessError.handle(err);
            return null;
        };
    });
};