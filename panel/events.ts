import { ipcRenderer } from 'electron';
import { assert, assertInteger, assertString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { useUnitStore } from '$vue/stores/units.js';
import { resources as resourceList } from '$global/utils/constants.js';
import { AresError } from '$global/error';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/plunder/resources.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';
import type { PlunderInfo } from '$deimos/models/plunder.js';
import type { UnitsAmount } from '$types/game.js';

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
            AresError.capture(err);
        };
    });

    ipcRenderer.on('update-plundered-amount', (_e, resources: PlunderedResources) => {
        try {
            if (plunderConfigStore.active === false) return;
        
            resourceList.forEach((res) => {
                assert(res in resources, 'Não foi possível atualizar a quantidade de recursos saqueados.');
                assertInteger(resources[res], 'A quantidade de recursos não é um número inteiro.');
                plunderHistoryStore[res] += resources[res];
            });
    
            plunderHistoryStore.attackAmount++;
        } catch (err) {
            AresError.capture(err);
        };
    });

    ipcRenderer.on('update-game-data', (_e, gameData: TribalWarsGameData) => aresStore.$patch(gameData));
    ipcRenderer.on('update-plunder-info', (_e, plunderInfo: PlunderInfo) => plunderStore.$patch(plunderInfo));
    ipcRenderer.on('update-current-village-units', (_e, units: UnitsAmount) => unitStore.$patch(units));
};