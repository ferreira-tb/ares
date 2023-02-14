import { BrowserWindow, ipcMain } from 'electron';
import { plunderStore } from '$electron/electron-store/plunder.js';
import { assertInteger, assertObjectHasSameProps, assertType } from '$electron/error.js';
import { assertCurrentWorld, getMainWindow, getPanelWindow } from '$electron/helpers.js';

export function setPlunderEvents() {
    const mainWindow = getMainWindow();
    const panelWindow = getPanelWindow();

    assertType(mainWindow instanceof BrowserWindow, 'Não foi possível obter a janela do browser.');
    assertType(panelWindow instanceof BrowserWindow, 'Não foi possível obter a janela do painel.');

    // Verifica se o Plunder está ativo ou não.
    ipcMain.handle('is-plunder-active', (_e, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();
        return plunderStore.get(`plunder-state.${world}.status`, false);
    });

    // Obtém o estado atual do Plunder.
    ipcMain.handle('get-plunder-state', (_e, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();
        return plunderStore.get(`plunder-state.${world}`, null);
    });

    // Salva o estado do Plunder.
    ipcMain.on('set-plunder-state', (_e, stateName: unknown, value: unknown, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();
        assertType(typeof stateName === 'string', 'O nome do estado é inválido.');
        
        plunderStore.set(`plunder-state.${world}.${stateName}`, value);
        mainWindow.webContents.send('plunder-state-update', stateName, value);
    });

    // Emitido pelo browser após cada ataque realizado pelo Plunder.
    // Atualiza a quantidade de recursos saqueados no painel.
    ipcMain.on('update-plundered-amount', (_e, resources: unknown) => {
        if (resources) panelWindow.webContents.send('update-plundered-amount', resources);
    });

    // Emitido pelo browser quando o Plunder é desativado.
    // Salva a quantidade de recursos saqueados durante a última execução do Plunder.
    ipcMain.on('save-plundered-amount', (_e, resources: unknown, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();

        const plundered = new PlunderedAmount(resources);
        plunderStore.set(`history.${world}.last`, plundered);

        const totalPlundered = plunderStore.get(`history.${world}.total`, null);
        if (totalPlundered) PlunderedAmount.sum(plundered, totalPlundered);
        
        plunderStore.set(`history.${world}.total`, plundered);
    });

    // Obtém a quantidade de recursos saqueados durante a última execução do Plunder.
    ipcMain.handle('get-last-plundered-amount', (_e, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();
        return plunderStore.get(`history.${world}.last`, null);
    });

    // Obtém a quantidade total de recursos saqueados em determinado mundo.
    ipcMain.handle('get-total-plundered-amount', (_e, world?: string) => {
        if (typeof world !== 'string') world = assertCurrentWorld();
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