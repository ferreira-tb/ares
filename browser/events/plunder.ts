import { ipcRenderer } from 'electron';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import type { Pinia } from 'pinia';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    type PlunderKeys = keyof typeof plunderConfigStore;
    type PlunderValues<T extends PlunderKeys> = typeof plunderConfigStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança no painel.
    ipcRenderer.on('plunder-config-updated', <K extends PlunderKeys>(_e: unknown, key: K, value: PlunderValues<K>) => {
        assert(key in plunderConfigStore, `${key} não é uma configuração válida para o Plunder.`);
        plunderConfigStore[key] = value;
    });
};