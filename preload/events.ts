import { ipcRenderer } from 'electron';
import { assert } from '@/error.js';
import { currentURL } from '$/preload.js';
import { usePlunderStore } from '@/stores/plunder.js';
import type { PlunderState, PlunderStateValue } from '@/stores/plunder.js';
import type { Pinia } from 'pinia';

export function setPreloadEvents(pinia: Pinia) {
    // Pinia.
    const plunderStore = usePlunderStore(pinia);
    
    // Atualiza a URL atual.
    ipcRenderer.on('game-url', (_e, url) => {
        assert(typeof url === 'string', 'A URL é inválida.');
        if (!url.includes('tribalwars')) return;
        currentURL.value = url;
    });

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança dele na janela filha.
    ipcRenderer.on('plunder-state-update', (_e, stateName: keyof PlunderState, value: PlunderStateValue) => {
        assert(stateName in plunderStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderStore[stateName] = value;
    });
};