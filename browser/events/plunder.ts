import { ipcRenderer } from 'electron';
import { assertKeyOf } from '@tb-dev/ts-guard';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { BrowserError } from '$browser/error.js';
import type { Pinia } from 'pinia';
import type { PlunderConfigType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            assertKeyOf<PlunderConfigType>(key, plunderConfigStore, `${key} não é uma configuração válida para o Plunder.`);
            Reflect.set(plunderConfigStore, key, value);
        } catch (err) {
            BrowserError.catch(err);
        };
    });
};