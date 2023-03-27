import { ipcRenderer } from 'electron';
import { assertKeyOf } from '@tb-dev/ts-guard';
import { usePlunderConfigStore } from '$global/stores/plunder';
import { BrowserError } from '$browser/error';
import type { Pinia } from 'pinia';
import type { PlunderConfigType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            assertKeyOf<PlunderConfigType>(key, plunderConfigStore);
            Reflect.set(plunderConfigStore, key, value);
        } catch (err) {
            BrowserError.catch(err);
        };
    });
};