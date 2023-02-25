import { ipcRenderer } from 'electron';
import { assertKeyOf, assertInteger } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { useFeaturesStore } from '$vue/stores/features.js';
import { usePlayerStore } from '$vue/stores/player.js';
import { useCurrentVillageStore } from '$vue/stores/village.js';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useUnitsStore } from '$vue/stores/units.js';
import { PanelError } from '$panel/error.js';
import type { TribalWarsGameDataType, UnitAmount } from '$types/game.js';
import type { PlunderConfigType, PlunderAttackDetails, PlunderInfoType, PlunderConfigKeys, PlunderConfigValues } from '$types/plunder.js';

export function setPanelWindowEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', (_e, key: PlunderConfigKeys, value: PlunderConfigValues) => {
        try {
            assertKeyOf<PlunderConfigType>(key, plunderConfigStore, `${key} não é uma configuração válida para o Plunder.`);
            Reflect.set(plunderConfigStore, key, value);
        } catch (err) {
            PanelError.catch(err);
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
            PanelError.catch(err);
        };
    });

    ipcRenderer.on('patch-panel-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
    });
    
    ipcRenderer.on('patch-panel-plunder-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcRenderer.on('patch-panel-plunder-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcRenderer.on('patch-panel-plunder-history', (_e, history: PlunderAttackDetails) => plunderHistoryStore.$patch(history));
    ipcRenderer.on('patch-panel-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
};