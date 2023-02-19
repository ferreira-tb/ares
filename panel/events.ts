import { ipcRenderer } from 'electron';
import { assertKeyOf, assertInteger, assertString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useUnitStore } from '$vue/stores/units.js';
import { resources as resourceList } from '$global/utils/constants.js';
import { PanelError } from '$panel/error.js';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/plunder/resources.js';
import type { TribalWarsGameDataType, PlunderInfoType } from '$types/deimos.js';
import type { UnitAmount } from '$types/game.js';
import type { PlunderConfigType, PlunderedAmount } from '$types/plunder.js';

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

    ipcRenderer.on('patch-panel-plundered-amount', (_e, resources: PlunderedResources) => {
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

    ipcRenderer.on('patch-panel-game-data', (_e, data: TribalWarsGameDataType) => aresStore.$patch(data));
    ipcRenderer.on('patch-panel-plunder-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcRenderer.on('patch-panel-plunder-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcRenderer.on('patch-panel-plunder-history', (_e, history: PlunderedAmount) => plunderHistoryStore.$patch(history));
    ipcRenderer.on('patch-panel-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));
};