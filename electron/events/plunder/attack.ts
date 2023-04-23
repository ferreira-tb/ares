import { ipcMain } from 'electron';
import { assertInteger } from '$global/guards';
import { MainProcessEventError } from '$electron/error';
import { assertUserAlias } from '$global/guards';
import { getPanelWindow } from '$electron/utils/helpers';
import { usePlunderHistoryStore, PlunderHistory, useCacheStore } from '$electron/interface';
import type { PlunderAttackLog } from '$types/plunder';

export function setPlunderAttackEvents() {
    const panelWindow = getPanelWindow();
    
    const cacheStore = useCacheStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder:attack-sent', <T extends keyof PlunderAttackLog>(_e: unknown, details: PlunderAttackLog) => {
        for (const [key, value] of Object.entries(details) as [T, PlunderAttackLog[T]][]) {
            assertInteger(value, `Could not update plunder history: ${key} is not an integer.`);
            plunderHistoryStore[key] += value;
        };

        panelWindow.webContents.send('plunder:attack-sent', details);
    });

    ipcMain.handle('plunder:get-history', (): PlunderAttackLog => {
        return {
            wood: plunderHistoryStore.wood,
            stone: plunderHistoryStore.stone,
            iron: plunderHistoryStore.iron,
            attackAmount: plunderHistoryStore.attackAmount,
            destroyedWalls: plunderHistoryStore.destroyedWalls
        };
    });

    ipcMain.on('plunder:save-history', async () => {
        try {
            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError, 'Could not save plunder history: user alias is not valid.');
            await PlunderHistory.saveHistory(userAlias, usePlunderHistoryStore());
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};