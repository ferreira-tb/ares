import { ipcRenderer } from 'electron';
import { assert, assertInteger, assertString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderHistoryStore, usePlunderConfigStore } from '$vue/stores/plunder.js';
import { resources as resourceList } from '$global/utils/constants.js';
import { AresError } from '$global/error';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/farm/resources.js';
import type { TribalWarsGameData } from '$deimos/models/data.js';

export function setPanelWindowEvents(pinia: Pinia) {
    const aresStore = useAresStore(pinia);
    const plunderConfigStore = usePlunderConfigStore(pinia);
    const plunderHistoryStore = usePlunderHistoryStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        try {
            assertString(url, 'A URL é inválida.');
            aresStore.currentURL = url;
        } catch (err) {
            AresError.handle(err);
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
            AresError.handle(err);
        };
    });

    ipcRenderer.on('update-game-data', (_e, gameData: TribalWarsGameData) => aresStore.$patch(gameData));
};