import { ipcRenderer } from 'electron';
import { assertKeyOf } from '@tb-dev/ts-guard';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import { BrowserError } from '$browser/error.js';
import type { Pinia } from 'pinia';
import type { PlunderConfigType } from '$types/plunder.js';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    type PlunderKeys = keyof PlunderConfigType;
    type PlunderValues = PlunderConfigType[PlunderKeys];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança no painel.
    ipcRenderer.on('plunder-config-updated', (_e: unknown, key: PlunderKeys, value: PlunderValues) => {
        try {
            assertKeyOf<PlunderConfigType>(key, plunderConfigStore, `${key} não é uma configuração válida para o Plunder.`);
            Reflect.set(plunderConfigStore, key, value);
        } catch (err) {
            BrowserError.catch(err);
        };
    });
};