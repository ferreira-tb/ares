import { ipcRenderer } from 'electron';
import { usePlunderConfigStore } from '$vue/stores/plunder.js';
import type { Pinia } from 'pinia';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    type PlunderKeys = keyof typeof plunderConfigStore;
    type PlunderValues<T extends PlunderKeys> = typeof plunderConfigStore[T];
    // Atualiza o estado local do Plunder sempre que ocorre uma mudança é provocada a partir do painel.
    ipcRenderer.on('plunder-state-update', <K extends PlunderKeys>(_e: unknown, stateName: K, value: PlunderValues<K>) => {
        assert(stateName in plunderConfigStore, `${stateName} não é um estado válido para o Plunder.`);
        plunderConfigStore[stateName] = value;
    });
};