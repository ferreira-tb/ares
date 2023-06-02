import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { assertInstanceOf } from '$shared/guards';
import { TribalWorker } from '$electron/worker';
import { getMainViewWebContents } from '$electron/utils/view';
import { getPanelWindow } from '$electron/utils/helpers';

export function fetchVillageGroups(): Promise<Set<VillageGroup>> {
    return new Promise(async (resolve, reject) => {
        // Cria o Phobos na tela de grupos manuais.
        // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
        const mainViewWebContents = getMainViewWebContents();
        const url = new URL(mainViewWebContents.getURL());
        url.search = 'screen=overview_villages&&mode=groups&type=static';

        const worker = new TribalWorker('get-village-groups', url, { override: true });
        await worker.init();
        
        const { port1, port2 } = new MessageChannelMain();
        worker.view.webContents.postMessage('port', null, [port2]);
        port1.postMessage({ channel: 'get-village-groups' } satisfies TribalWorkerPortMessage);

        port1.on('message', (e) => {
            try {
                assertInstanceOf<Set<VillageGroup>>(e.data, Set, 'Village groups must be a Set');
                resolve(e.data);
            } catch (err) {
                reject(err);
            } finally {
                port1.close();
                worker.destroy();
            };
        });

        port1.start();
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