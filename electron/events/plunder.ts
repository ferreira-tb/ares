import { ipcMain } from 'electron';
import { assertInteger, assertObjectHasSameProps, assertType } from '../error.js';
import { plunderStore } from '../store/plunder.js';
import { assertCurrentWorld } from '../helpers.js';
import type { BrowserWindow } from 'electron';

export function setPlunderEvents(mainWindow: BrowserWindow, childWindow: BrowserWindow) {
    ipcMain.handle('is-plunder-active', () => {
        const world = assertCurrentWorld(mainWindow);
        return plunderStore.get(`plunder-state.${world}.status`, false);
    });

    ipcMain.handle('get-plunder-state', () => {
        const world = assertCurrentWorld(mainWindow);
        return plunderStore.get(`plunder-state.${world}`, null);
    });

    ipcMain.on('set-plunder-state', (_e, stateName: unknown, value: unknown) => {
        const world = assertCurrentWorld(mainWindow);
        assertType(typeof stateName === 'string', 'O nome do estado é inválido.');
        
        plunderStore.set(`plunder-state.${world}.${stateName}`, value);
        mainWindow.webContents.send('plunder-state-update', stateName, value);
    });

    // Emitido pela janela mãe após cada ataque realizado pelo Plunder.
    ipcMain.on('update-plundered-amount', (_e, resources: unknown) => {
        if (resources) childWindow.webContents.send('update-plundered-amount', resources);
    });

    // Emitido pela janela filha quando o Plunder é desativado.
    ipcMain.on('save-plundered-amount', (_e, resources: unknown) => {
        const world = assertCurrentWorld(mainWindow);

        const plundered = new PlunderedAmount(resources);
        plunderStore.set(`history.${world}.last`, plundered);

        const totalPlundered = plunderStore.get(`history.${world}.total`, null);
        if (totalPlundered) PlunderedAmount.sum(plundered, totalPlundered);
        
        plunderStore.set(`history.${world}.total`, plundered);
    });

    ipcMain.handle('get-last-plundered-amount', (_e, world?: string) => {
        if (!world) world = assertCurrentWorld(mainWindow);
        return plunderStore.get(`history.${world}.last`, null);
    });

    ipcMain.handle('get-total-plundered-amount', (_e, world?: string) => {
        if (!world) world = assertCurrentWorld(mainWindow);
        return plunderStore.get(`history.${world}.total`, null);
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