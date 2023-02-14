import { ipcRenderer } from 'electron';
import { assert, assertType } from '$global/error.js';
import { usePlunderStore } from '$vue/stores/plunder.js';
import { useAresStore } from '$vue/stores/ares.js';
import type { Pinia } from 'pinia';

export function setPreloadEvents(pinia: Pinia) {
    // Pinia.
    const plunderStore = usePlunderStore(pinia);
    const aresStore = useAresStore(pinia);
    
    // Atualiza a URL atual.
    ipcRenderer.on('page-url', (_e, url) => {
        assertType(typeof url === 'string', 'A URL é inválida.');
        if (/\.?tribalwars/.test(url)) aresStore.currentURL = url;
    });

    type PlunderKeys = keyof typeof plunderStore;
    type PlunderValue<T extends PlunderKeys> = typeof plunderStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança dele na janela filha.
    ipcRenderer.on('plunder-state-update', <K extends PlunderKeys>(_e: unknown, stateName: K, value: PlunderValue<K>) => {
        assert(stateName in plunderStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderStore[stateName] = value;
    });
};