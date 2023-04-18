import { URL } from 'url';
import { MessageChannelMain } from 'electron';
import { assertInstanceOf } from '$global/guards';
import { createPhobos, destroyPhobos } from '$electron/app/phobos';
import { getMainViewWebContents } from '$electron/utils/view';
import { getPanelWindow } from '$electron/utils/helpers';
import type { MechanusRef } from 'mechanus';
import type { VillageGroup } from '$types/game';
import type { PhobosPortMessage } from '$types/phobos';

export function fetchVillageGroups() {
    return new Promise<Set<VillageGroup>>(async (resolve, reject) => {
        // Cria o Phobos na tela de grupos manuais.
        // Lá é possível obter tanto os grupos manuais quanto os dinâmicos.
        const mainViewWebContents = getMainViewWebContents();
        const url = new URL(mainViewWebContents.getURL());
        url.search = 'screen=overview_villages&&mode=groups&type=static';
        const phobos = await createPhobos('get-village-groups', url, { override: true });
        
        const { port1, port2 } = new MessageChannelMain();
        phobos.webContents.postMessage('port', null, [port2]);
        port1.postMessage({ channel: 'get-village-groups' } satisfies PhobosPortMessage);

        port1.on('message', (e) => {
            try {
                assertInstanceOf<Set<VillageGroup>>(e.data, Set, 'Village groups must be a Set');
                resolve(e.data);
            } catch (err) {
                reject(err);
            } finally {
                port1.close();
                destroyPhobos(phobos);
            };
        });

        port1.start();
    });
};

export function patchVillageGroups(groups: Set<VillageGroup>, all: MechanusRef<Set<VillageGroup>>) {
    all.value.clear();
    groups.forEach((group) => {
        all.value.add(group);
    });

    const panelWindow = getPanelWindow();
    panelWindow.webContents.send('panel:patch-village-groups-set', all.value);
};