import { ipcMain } from 'electron';
import { TribalWorker } from '$electron/worker';
import { BrowserTab } from '$electron/tabs';
import { GameSearchParams, TribalWorkerName } from '$common/enum';
import { MainProcessError } from '$electron/error';

export function setUnitsEvents() {
    ipcMain.handle('game:count-troops', async (_e, group: number = 0) => {
        try {
            const amount = await countTroops(group);
            return amount;
        } catch (err) {
            MainProcessError.catch(err);
            return null;
        }
    });
}

function countTroops(group: number) {
    return new Promise<TroopCounterResult | null>((resolve, reject) => {
        const url = BrowserTab.createURL(GameSearchParams.OverviewUnitsComplete);
        url.searchParams.set('group', group.toString(10));

        const worker = new TribalWorker(TribalWorkerName.CountTroops, url);
        worker.once('destroyed', reject);
        worker.once('message', (message: TroopCounterResult | null) => {
            resolve(message);
            worker.destroy();
        });

        worker.init().catch(reject);
    });
}