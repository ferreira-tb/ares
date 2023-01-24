import { ipcRenderer } from 'electron';
import { assert, assertType } from '@/error.js';
import { usePlunderStore } from '@/stores/plunder.js';
import { usePhobiaStore } from '@/stores/store.js';
import { getReportDataset } from '../dev/dataset.js';
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

    type PlunderKeys = keyof typeof plunderStore;
    type PlunderValue<T extends PlunderKeys> = typeof plunderStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança dele na janela filha.
    ipcRenderer.on('plunder-state-update', <K extends PlunderKeys>(_e: unknown, stateName: K, value: PlunderValue<K>) => {
        assert(stateName in plunderStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderStore[stateName] = value;
    });

    setDevEvents();
};

function setDevEvents() {
    ipcRenderer.on('dev-report-dataset', () => getReportDataset());
};