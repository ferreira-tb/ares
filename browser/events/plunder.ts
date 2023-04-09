import { ipcRenderer } from 'electron';
import { usePlunderConfigStore } from '$renderer/stores/plunder';

export function setPlunderEvents() {
    const plunderConfigStore = usePlunderConfigStore();

    // Atualiza o estado local do Plunder sempre que ocorre uma mudança.
    ipcRenderer.on('plunder-config-updated', <T extends keyof typeof plunderConfigStore>(
        _e: unknown, key: T, value: typeof plunderConfigStore[T]
    ) => {
        plunderConfigStore[key] = value;
    });
};