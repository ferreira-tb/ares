import { ipcMain } from 'electron';
import { assertInteger } from '@tb-dev/ts-guard';
import { sequelize } from '$electron/database';
import { MainProcessEventError } from '$electron/error';
import { assertUserAlias } from '$electron/utils/guards';
import { getPanelWindow } from '$electron/utils/helpers';
import { useLastPlunderHistoryStore, useTotalPlunderHistoryStore, PlunderHistory, useCacheStore } from '$electron/interface';
import type { PlunderAttackDetails } from '$types/plunder';

export function setPlunderAttackEvents() {
    const panelWindow = getPanelWindow();
    
    const cacheStore = useCacheStore();
    const lastPlunderHistoryStore = useLastPlunderHistoryStore();
    const totalPlunderHistoryStore = useTotalPlunderHistoryStore();

    // Emitido pela view após cada ataque realizado pelo Plunder.
    ipcMain.on('plunder-attack-sent', (_e, details: PlunderAttackDetails) => {
        panelWindow.webContents.send('plunder-attack-sent', details);
    });

    ipcMain.handle('get-last-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            return (await PlunderHistory.getHistoryAsJSON(cacheStore))?.last ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    ipcMain.handle('get-total-plunder-attack-details', async (): Promise<PlunderAttackDetails | null> => {
        try {
            return (await PlunderHistory.getHistoryAsJSON(cacheStore))?.total ?? null;
        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    // Emitido pela view quando o Plunder é desativado.
    ipcMain.on('save-plunder-attack-details', async (_e, details: PlunderAttackDetails) => {
        try {
            for (const [key, value] of Object.entries(details) as [keyof PlunderAttackDetails, number][]) {
                assertInteger(value, `Could not save plunder attack details: ${key} is not an integer.`);
                lastPlunderHistoryStore[key] = value;
                totalPlunderHistoryStore[key] += value;
            };

            const userAlias = cacheStore.userAlias;
            assertUserAlias(userAlias, MainProcessEventError);

            await sequelize.transaction(async (transaction) => {
                await PlunderHistory.upsert({
                    id: userAlias,
                    last: { ...lastPlunderHistoryStore },
                    total: { ...totalPlunderHistoryStore }
                }, { transaction });
            });

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};