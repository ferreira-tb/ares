import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { isPositiveInteger } from '@tb-dev/ts-guard';
import { MainProcessEventError } from '$electron/error';
import { plunderSearchParams } from '$electron/utils/constants';
import { generateRandomDelay } from '$electron/utils/helpers';
import { usePlunderConfigStore, usePlunderCacheStore } from '$electron/interface';
import type { PlunderGroupType, PlunderGroupVillageType } from '$types/plunder';

export function setPlunderGroupEvents() {
    const plunderCacheStore = usePlunderCacheStore();
    const plunderConfigStore = usePlunderConfigStore();
    const { plunderGroup } = storeToRefs(plunderCacheStore);

    ipcMain.handle('get-plunder-group-info', () => plunderGroup.value);

    ipcMain.handle('update-plunder-group-info', (_e, groupInfo: PlunderGroupType | null) => {
        try {
            plunderGroup.value = groupInfo;
            return true;
        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('navigate-to-next-plunder-village', (e, currentVillageId?: number | null) => {
        try {
            if (!plunderGroup.value) return false;
            let villages = Array.from(plunderGroup.value.villages.entries());

            // Se todas as aldeias do grupo já foram atacadas, avisa a view.
            if (villages.length > 0 && villages.every(([, { done }]) => done)) {
                e.sender.send('plunder-group-is-exhausted');
                return false;
            };

            // Do contrário, remove as aldeias que já atacaram, além da aldeia atual se houver um id válido.
            villages = villages.filter(([, { done }]) => !done);
            if (isPositiveInteger(currentVillageId)) {
                villages = villages.filter(([id]) => id !== currentVillageId);
            };
            
            if (villages.length === 0) return false;

            const nextVillage = villages.reduce((prev, curr) => {
                if (!prev) return curr;
                if (curr[1].waveMaxDistance < prev[1].waveMaxDistance) return curr;
                return prev;
            }, null as [number, PlunderGroupVillageType] | null);

            if (!nextVillage) return false;

            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            url.searchParams.set('village', nextVillage[0].toString(10));
            url.searchParams.set('group', plunderGroup.value.id.toString(10));
            
            const delay = generateRandomDelay(plunderConfigStore.villageDelay, 200);
            setTimeout(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch), delay);
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });

    ipcMain.handle('navigate-to-plunder-group', (e) => {
        try {
            if (!plunderConfigStore.plunderGroupId) return false;

            const url = new URL(e.sender.getURL());
            url.search = plunderSearchParams;
            url.searchParams.set('group', plunderConfigStore.plunderGroupId.toString(10));
            queueMicrotask(() => e.sender.loadURL(url.href).catch(MainProcessEventError.catch));
            return true;

        } catch (err) {
            MainProcessEventError.catch(err);
            return false;
        };
    });
};