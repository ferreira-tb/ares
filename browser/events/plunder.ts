import { ipcRenderer } from 'electron';
import { usePlunderConfigStore } from '$global/stores/plunder';
import type { Pinia } from 'pinia';

export function setPlunderEvents(pinia: Pinia) {
    const plunderConfigStore = usePlunderConfigStore(pinia);

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', <T extends keyof typeof plunderConfigStore>(
        _e: unknown, key: T, value: typeof plunderConfigStore[T]
    ) => {
        plunderConfigStore[key] = value;
    });
};