import { ipcRenderer } from 'electron';
import { assert, assertInteger, assertString } from '@tb-dev/ts-guard';
import { useAresStore } from '$vue/stores/ares.js';
import { usePlunderHistoryStore, usePlunderStore } from '$vue/stores/plunder.js';
import { resources as resourceList } from '$global/utils/constants.js';
import type { Pinia } from 'pinia';
import type { PlunderedResources } from '$lib/farm/resources.js';

export function setPanelWindowEvents(pinia: Pinia) {
    const aresStore = useAresStore(pinia);
    const plunderStore = usePlunderStore(pinia);
    const plunderHistoryStore = usePlunderHistoryStore(pinia);

    ipcRenderer.on('page-url', (_e, url: unknown) => {
        assertString(url, 'A URL é inválida.');
        aresStore.currentURL = url;
    });

    ipcRenderer.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        assertInteger(currentX, 'A coordenada X é inválida.');
        assertInteger(currentY, 'A coordenada Y é inválida.');
        aresStore.currentX = currentX;
        aresStore.currentY = currentY;
    });

    ipcRenderer.on('update-plundered-amount', (_e, resources: PlunderedResources) => {
        if (plunderStore.status === false) return;
        
        resourceList.forEach((res) => {
            assert(res in resources, 'Não foi possível atualizar a quantidade de recursos saqueados.');
            assertInteger(resources[res], 'A quantidade de recursos não é um número inteiro.');
            plunderHistoryStore[res] += resources[res];
        });

        plunderHistoryStore.attackAmount++;
    });
};