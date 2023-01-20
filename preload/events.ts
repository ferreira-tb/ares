import { ipcRenderer } from 'electron';
import { assert, assertType } from '@/error.js';
import { usePlunderStore } from '@/stores/plunder.js';
import { usePhobiaStore } from '@/stores/store.js';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';
import type { Pinia } from 'pinia';


export function setPreloadEvents(pinia: Pinia) {
    // Pinia.
    const plunderStore = usePlunderStore(pinia);
    const phobiaStore = usePhobiaStore(pinia);
    
    // Atualiza a URL atual.
    ipcRenderer.on('page-url', (_e, url) => {
        assertType(typeof url === 'string', 'A URL é inválida.');
        if (!url.includes('tribalwars')) return;
        phobiaStore.currentURL = url;
    });

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança dele na janela filha.
    ipcRenderer.on('plunder-state-update', (_e, stateName: keyof PlunderState, value: PlunderStateValue) => {
        assert(stateName in plunderStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderStore[stateName] = value;
    });
};