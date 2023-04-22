import { ipcMain } from 'electron';
import { assertInteger } from '$global/guards';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { isUserAlias, assertUserAlias } from '$global/guards';
import { getPanelWindow } from '$electron/utils/helpers';
import { usePlunderHistoryStore, PlunderHistory, useCacheStore } from '$electron/interface';
import type { PlunderAttackLog } from '$types/plunder';
import type { UserAlias } from '$types/electron';

export function setPlunderAttackEvents() {
    const panelWindow = getPanelWindow();
    
    const cacheStore = useCacheStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder:attack-sent', (_e, details: PlunderAttackLog) => {
        for (const [key, value] of Object.entries(details) as [keyof PlunderAttackLog, number][]) {
            assertInteger(value, `Could not update plunder history: ${key} is not an integer.`);
            plunderHistoryStore[key] += value;
        };

        panelWindow.webContents.send('plunder:attack-sent', details);
    });

    ipcMain.handle('plunder:get-history', async (_e, userAlias?: UserAlias | null) => {
        try {
            userAlias ??= cacheStore.userAlias;
            if (!isUserAlias(userAlias)) return null;

            const plunderHistory = (await PlunderHistory.findByPk(userAlias))?.toJSON();
            if (!plunderHistory) return null;
            
            return {
                wood: plunderHistory.wood,
                stone: plunderHistory.stone,
                iron: plunderHistory.iron,
                attackAmount: plunderHistory.attackAmount,
                destroyedWalls: plunderHistory.destroyedWalls
            } satisfies PlunderAttackLog;

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    // Emitido pela view quando o Plunder é desativado.
    ipcMain.on('plunder:save-history', async () => {
        try {
            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError, 'Could not save plunder history: user alias is not valid.');

            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    wood: plunderHistoryStore.wood,
                    stone: plunderHistoryStore.stone,
                    iron: plunderHistoryStore.iron,
                    attackAmount: plunderHistoryStore.attackAmount,
                    destroyedWalls: plunderHistoryStore.destroyedWalls
                }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};