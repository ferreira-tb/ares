import { URL } from 'node:url';
import { TribalWorker } from '$electron/worker';
import { getMainViewWebContents } from '$electron/utils/view';
import { getPanelWindow } from '$electron/utils/helpers';
import { GameSearchParams, TribalWorkerName } from '$common/constants';

export function fetchVillageGroups(): Promise<Set<VillageGroup>> {
    return new Promise(async (resolve, reject) => {
        // Cria o Worker na tela de grupos manuais.
        // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
        const mainViewWebContents = getMainViewWebContents();
        const url = new URL(mainViewWebContents.getURL());
        url.search = GameSearchParams.Groups;

        const worker = new TribalWorker(TribalWorkerName.GetVillageGroups, url);
        await worker.init((e) => {
            try {
                if (!(e.data instanceof Set)) {
                    throw new Error('Village groups data must be a Set.');
                };
                resolve(e.data);
            } catch (err) {
                reject(err);
            } finally {
                worker.destroy();
            };
        });
    });
};

export function patchVillageGroups(groups: Set<VillageGroup>, all: MechanusRef<Set<VillageGroup>>): void {
    all.value.clear();
    groups.forEach((group) => {
        all.value.add(group);
    });

    const panelWindow = getPanelWindow();
    panelWindow.webContents.send('panel:patch-village-groups-set', all.value);
};