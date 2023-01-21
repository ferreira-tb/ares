import { ipcMain } from 'electron';
import { assertInteger, assertObjectHasSameProps, assertType, MainProcessError } from '#/error.js';
import { plunderStore } from '#/store/plunder.js';
import { getCurrentWorld } from '#/helpers.js';
import type { BrowserWindow } from 'electron';

export function setPlunderEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => {
        const world = getCurrentWorld(mainWindow);
        if (world === null) return false;
        return plunderStore.get(`plunder-state.${world}.status`, false);
    });

    ipcMain.handle('get-plunder-state', () => {
        const world = getCurrentWorld(mainWindow);
        if (world === null) return null;
        return plunderStore.get(`plunder-state.${world}`, null);
    });

    ipcMain.on('set-plunder-state', (_e, stateName: unknown, value: unknown) => {
        try {
            const world = getCurrentWorld(mainWindow);
            assertType(typeof world === 'string', 'O mundo é inválido.');
            assertType(typeof stateName === 'string', 'O nome do estado é inválido.');
            
            plunderStore.set(`plunder-state.${world}.${stateName}`, value);
            mainWindow.webContents.send('plunder-state-update', stateName, value);
        } catch (err) {
            MainProcessError.handle(err);
        };
    });

    // Emitido pela janela mãe após cada ataque realizado pelo Plunder.
    ipcMain.on('update-plundered-amount', (_e, resources: unknown) => {
        if (resources) childWindow.webContents.send('update-plundered-amount', resources);
    });

    // Emitido pela janela filha quando o Plunder é desativado.
    ipcMain.on('save-plundered-amount', (_e, resources: unknown) => {
        const world = getCurrentWorld(mainWindow);
        assertType(typeof world === 'string', 'O mundo é inválido.');

        const plundered = new PlunderedAmount(resources);
        plunderStore.set(`history.${world}.last`, plundered);

        const totalPlundered = plunderStore.get(`history.${world}.total`, null);
        if (totalPlundered) PlunderedAmount.sum(plundered, totalPlundered);
        
        plunderStore.set(`history.${world}.total`, plundered);
    });
};

class PlunderedAmount {
    wood = 0;
    stone = 0;
    iron = 0;
    total = 0;
    attackAmount = 0;

    constructor(resources: unknown) {
        PlunderedAmount.sum(this, resources);
    };

    public static sum(base: PlunderedAmount, resources: unknown) {
        assertObjectHasSameProps(base, resources);
        for (const key of Object.keys(base) as (keyof PlunderedAmount)[]) {
            assertInteger(resources[key], 'A quantidade de um dos recursos é inválida.');
            base[key] += resources[key];
        };
    };
};