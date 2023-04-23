import { ipcMain } from 'electron';
import { assertInteger } from '$global/guards';
import { MainProcessEventError } from '$electron/error';
import { assertUserAlias } from '$global/guards';
import { getPanelWindow } from '$electron/utils/helpers';
import { usePlunderHistoryStore, PlunderHistory, useCacheStore } from '$electron/interface';
import { PlunderHistoryVillage } from '$global/objects/plunder';
import type { PlunderAttackLog } from '$types/plunder';

export function setPlunderHistoryEvents() {
    const panelWindow = getPanelWindow();
    
    const cacheStore = useCacheStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder:attack-sent', <T extends keyof PlunderAttackLog>(
        _e: unknown, villageId: number | null, attackLog: PlunderAttackLog
    ) => {
        assertInteger(villageId, 'Could not update plunder history: village id is invalid.');
        // A propriedade `villages` está envolvida em um Proxy.
        // Se não houverem registros de ataque contra a aldeia, o Proxy criará uma nova array.
        const village = plunderHistoryStore.villages[villageId.toString(10)];
        const midnight = new Date().setUTCHours(0, 0, 0, 0);
        let today = village.find((log) => log.addedAt === midnight);
        if (!today) {
            today = new PlunderHistoryVillage();
            village.push(today);
        };

        for (const [key, value] of Object.entries(attackLog) as [T, PlunderAttackLog[T]][]) {
            assertInteger(value, `Could not update plunder history: ${key} is not an integer.`);
            plunderHistoryStore[key] += value;
            today[key] += value;
        };

        panelWindow.webContents.send('plunder:attack-sent', attackLog);
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