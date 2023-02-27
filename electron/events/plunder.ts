import { ipcMain, BrowserWindow, type WebContents } from 'electron';
import { assertObject, assertInteger, isKeyOf, isObject, isInteger } from '@tb-dev/ts-guard';
import { getPanelWindow } from '$electron/utils/helpers.js';
import { assertUserAlias, isUserAlias, isWorld } from '$electron/utils/guards.js';
import { sequelize } from '$database/database.js';
import { MainProcessEventError } from '$electron/error.js';
import type { PlunderAttackDetails, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';
import type { UnitAmount, World } from '$types/game.js';
import type { WorldUnitType } from '$types/world.js';

import {
    PlunderHistory,
    PlunderConfig,
    plunderConfigProxy,
    plunderHistoryProxy,
    cacheProxy,
    WorldUnit,
    worldUnitProxy
} from '$interface/index.js';

export function setPlunderEvents() {
    const panelWindow = getPanelWindow();

    // Verifica se o Plunder está ativo.
    ipcMain.handle('is-plunder-active', () => plunderConfigProxy.active);
    
    // Obtém as configurações do Plunder.
    ipcMain.handle('get-plunder-config', () => {
        const alias = cacheProxy.userAlias;
        if (isUserAlias(alias)) return { ...plunderConfigProxy };
        return null;
    });

    // Recebe as configurações do Plunder do painel ou do módulo de configuração e as salva no banco de dados.
    ipcMain.on('update-plunder-config', async (e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            if (!isKeyOf(key, plunderConfigProxy)) return;
            const previousValue = Reflect.get(plunderConfigProxy, key);
            if (previousValue === value) return;

            // A confirmação dos tipos é feita no Proxy.
            Reflect.set(plunderConfigProxy, key, value);

            // Comunica a mudança aos processos diferentes daquele que enviou os dados.
            for (const browserWindow of BrowserWindow.getAllWindows()) {
                if (browserWindow.webContents !== (e.sender satisfies WebContents)) {
                    browserWindow.webContents.send('plunder-config-updated', key, value);
                };
            };

            const userAlias = cacheProxy.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderConfig.upsert({ id: userAlias, ...plunderConfigProxy }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Emitido pelo browser após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder-attack-sent', (_e, details: PlunderAttackDetails) => {
        try {
            assertObject(details, 'Erro ao atualizar os detalhes do ataque: o objeto é inválido.');
            panelWindow.webContents.send('plunder-attack-sent', details);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    // Emitido pelo browser quando o Plunder é desativado.
    ipcMain.on('save-plunder-attack-details', async (_e, details: PlunderAttackDetails) => {
        try {
            assertObject(details, 'Erro ao salvar os detalhes do ataque: o objeto é inválido.');

            for (const [key, value] of Object.entries(details) as [keyof PlunderAttackDetails, number][]) {
                assertInteger(value, 'Erro ao salvar os detalhes do ataque: valor inválido.');
                plunderHistoryProxy.last[key] = value;
                plunderHistoryProxy.total[key] += value;
            };

            const userAlias = cacheProxy.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    last: { ...plunderHistoryProxy.last },
                    total: { ...plunderHistoryProxy.total }
                }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.handle('get-last-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            const history = await PlunderHistory.getHistoryAsJSON(cacheProxy);
            if (!isObject(history)) return null;
            return history.last;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.handle('get-total-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            const history = await PlunderHistory.getHistoryAsJSON(cacheProxy);
            if (!isObject(history)) return null;
            return history.total;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.handle('calc-carry-capacity', async (_e, units: Partial<UnitAmount>, world?: World | null) => {
        try {
            world ??= cacheProxy.world;
            if (!isWorld(world)) return null;

            let worldUnits: WorldUnitType;
            if (world === cacheProxy.world) {
                worldUnits = { ...worldUnitProxy };
            } else {
                const worldUnitsRow = await WorldUnit.findByPk(world);
                if (!isObject(worldUnitsRow)) return null;
                worldUnits = worldUnitsRow.toJSON();
            };
            
            const entries = Object.entries(units) as [keyof UnitAmount, number][];
            return entries.reduce((carryCapacity, [unit, amount]) => {
                const unitCapacity = worldUnits[unit]?.carry;
                if (isInteger(unitCapacity)) carryCapacity += unitCapacity * amount;
                return carryCapacity;
            }, 0);

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });
};