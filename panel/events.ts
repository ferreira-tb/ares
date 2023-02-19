import { ipcRenderer } from 'electron';
import { assertKeyOf, assertInteger, assertString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useUnitStore } from '$vue/stores/units.js';
import { resources as resourceList } from '$global/utils/constants.js';
import { PanelError } from '$panel/error.js';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/plunder/resources.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';
import type { UnitAmount } from '$types/game.js';
import type { PlunderConfigType, PlunderHistoryType } from '$types/plunder.js';

export function setPanelWindowEvents(pinia: Pinia) {
    const aresStore = useAresStore(pinia);
    const unitStore = useUnitStore(pinia);
    const plunderStore = usePlunderStore(pinia);
    const plunderConfigStore = usePlunderConfigStore(pinia);
    const plunderHistoryStore = usePlunderHistoryStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            PanelError.catch(err);
        };
    });

    ipcRenderer.on('update-plundered-amount', (_e, resources: PlunderedResources) => {
        try {
            if (plunderConfigStore.active === false) return;
        
            resourceList.forEach((res) => {
                assertKeyOf(res, resources, 'Não foi possível atualizar a quantidade de recursos saqueados.');
                assertInteger(resources[res], 'A quantidade de recursos não é um número inteiro.');
                plunderHistoryStore[res] += resources[res];
            });
    
            plunderHistoryStore.attackAmount++;
        } catch (err) {
            PanelError.catch(err);
        };
    });

    ipcRenderer.on('update-game-data', (_e, data: TribalWarsGameData) => aresStore.$patch(data));
    ipcRenderer.on('update-plunder-info', (_e, info: PlunderInfo) => plunderStore.$patch(info));
    ipcRenderer.on('update-plunder-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcRenderer.on('update-plunder-history', (_e, history: PlunderHistoryType['last']) => plunderHistoryStore.$patch(history));
    ipcRenderer.on('update-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
};