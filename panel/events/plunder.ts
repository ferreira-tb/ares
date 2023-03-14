import { ipcRenderer } from 'electron';
import { assertKeyOf, assertInteger } from '@tb-dev/ts-guard';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder';
import { PanelPlunderError } from '$panel/error';

import type {
    PlunderConfigType,
    PlunderAttackDetails,
    PlunderInfoType,
    PlunderConfigKeys,
    PlunderConfigValues
} from '$types/plunder.js';

export function setPlunderEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            assertKeyOf<PlunderConfigType>(key, plunderConfigStore, `${key} não é uma configuração válida para o Plunder.`);
            Reflect.set(plunderConfigStore, key, value);
        } catch (err) {
            PanelPlunderError.catch(err);
        };
    });

    ipcRenderer.on('plunder-attack-sent', (_e, details: PlunderAttackDetails) => {
        try {
            if (plunderConfigStore.active === false) return;
            for (const [key, value] of Object.entries(details)) {
                assertKeyOf<PlunderAttackDetails>(key, plunderHistoryStore, `${key} não é uma chave válida para o Plunder.`);
                assertInteger(value, `${key} não é um número inteiro.`);

                // O valor de `total` é gerado automaticamente por um `computed` e não deve ser atualizado manualmente.
                if (key === 'total') continue;

                plunderHistoryStore[key] += value;
            };

        } catch (err) {
            PanelPlunderError.catch(err);
        };
    });

    ipcRenderer.on('patch-panel-plunder-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcRenderer.on('patch-panel-plunder-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcRenderer.on('patch-panel-plunder-history', (_e, history: PlunderAttackDetails) => plunderHistoryStore.$patch(history));
};