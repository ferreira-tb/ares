import { URL } from 'node:url';
import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { isInteger } from '$common/guards';
import { MainProcessEventError } from '$electron/error';
import { GameSearchParams } from '$common/constants';
import { generateRandomDelay } from '$common/helpers';
import { usePlunderConfigStore, usePlunderCacheStore } from '$electron/interface';

export function setPlunderGroupEvents() {
    const plunderCacheStore = usePlunderCacheStore();
    const plunderConfigStore = usePlunderConfigStore();
    const { plunderGroup } = storeToRefs(plunderCacheStore);

    ipcMain.handle('plunder:get-group-info', () => plunderGroup.value);

    ipcMain.on('plunder:update-group-info', (_e, groupInfo: PlunderGroupType | null) => {
        try {
            plunderGroup.value = groupInfo;
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.on('plunder:navigate-to-next-village', (e, currentVillageId?: number | null) => {
        try {
            if (!plunderGroup.value) return;
            let villages = Array.from(plunderGroup.value.villages.entries());

            // Se todas as aldeias do grupo já foram atacadas, avisa a view.
            if (villages.length > 0 && villages.every(([, { done }]) => done)) {
                e.sender.send('plunder-group-is-exhausted');
                return;
            };

            // Do contrário, remove as aldeias que já atacaram, além da aldeia atual se houver um id válido.
            villages = villages.filter(([, { done }]) => !done);
            if (isInteger(currentVillageId) && currentVillageId > 0) {
                villages = villages.filter(([id]) => id !== currentVillageId);
            };
            
            if (villages.length === 0) return;

            const nextVillage = villages.reduce((prev, curr) => {
                if (!prev) return curr;
                if (curr[1].waveMaxDistance < prev[1].waveMaxDistance) return curr;
                return prev;
            }, null as [number, PlunderGroupVillageType] | null);

            if (!nextVillage) return;

            const url = new URL(e.sender.getURL());
            url.search = GameSearchParams.Farm;
            url.searchParams.set('village', nextVillage[0].toString(10));
            url.searchParams.set('group', plunderGroup.value.id.toString(10));
            
            const delay = generateRandomDelay(plunderConfigStore.villageDelay, 200);
            e.sender.send('plunder:set-navigation-timer', url.href, delay);

        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });

    ipcMain.on('plunder:navigate-to-group', async (e) => {
        try {
            if (!plunderConfigStore.plunderGroupId) return;

            const url = new URL(e.sender.getURL());
            url.search = GameSearchParams.Farm;
            url.searchParams.set('group', plunderConfigStore.plunderGroupId.toString(10));
            await e.sender.loadURL(url.href);
        } catch (err) {
            MainProcessEventError.catch(err);
        };
    });
};