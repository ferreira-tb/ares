import { ipcRenderer } from 'electron';
import { assert, assertInteger, assertType } from '#/error.js';
import { useAresStore } from '#/vue/stores/store.js';
import { usePlunderHistoryStore, usePlunderStore } from '#/vue/stores/plunder.js';
import { resources as resourceList } from '#/constants.js';
import type { Pinia } from 'pinia';
import type { ExpectedResources } from '$/farm/resources.js';

export function setChildWindowEvents(pinia: Pinia) {
    const aresStore = useAresStore(pinia);
    const plunderStore = usePlunderStore(pinia);
    const plunderHistoryStore = usePlunderHistoryStore(pinia);

    ipcRenderer.on('page-url', (_e, url) => {
        assertType(typeof url === 'string', 'A URL é inválida.');
        if (!url.includes('tribalwars')) return;
        aresStore.currentURL = url;
    });

    ipcRenderer.on('update-current-coords', (_e, currentX: number, currentY: number) => {
        assertType(typeof currentX === 'number', 'A coordenada X é inválida.');
        assertType(typeof currentY === 'number', 'A coordenada Y é inválida.');
        aresStore.currentX = currentX;
        aresStore.currentY = currentY;
    });

    ipcRenderer.on('update-plundered-amount', (_e, resources: ExpectedResources) => {
        if (plunderStore.status === false) return;
        
        resourceList.forEach((res) => {
            assert(res in resources, 'Não foi possível atualizar a quantidade de recursos saqueados.');
            assertInteger(resources[res], 'A quantidade de recursos não é um número inteiro.');
            plunderHistoryStore[res] += resources[res];
        });

        plunderHistoryStore.attackAmount++;
    });
};