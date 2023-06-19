import { ipcMain } from 'electron';
import { TribalWorker } from '$electron/worker';
import { BrowserTab } from '$electron/tabs';
import { GameSearchParams, TribalWorkerName } from '$common/enum';
import { MainProcessError } from '$electron/error';

export function setAllyEvents() {
    ipcMain.handle('game:fetch-diplomacy', async () => {
        try {
            const diplomacy = await fetchDiplomacy();
            return diplomacy;
        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    });
};

function fetchDiplomacy() {
    return new Promise<RawDiplomacy | null>((resolve, reject) => {
        const url = BrowserTab.createURL(GameSearchParams.Contracts);
        const worker = new TribalWorker(TribalWorkerName.FetchDiplomacy, url);
        worker.once('destroyed', reject);
        worker.once('port:message', (message: RawDiplomacy | null) => {
            resolve(message);
            worker.destroy();
        });

        worker.init().catch(reject);
    });
};