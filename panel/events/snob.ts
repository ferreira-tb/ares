import { ipcRenderer } from 'electron';
import { useSnobConfigStore, useSnobHistoryStore } from '$renderer/stores';

export function setSnobEvents() {
    const snobConfigStore = useSnobConfigStore();
    const snobHistoryStore = useSnobHistoryStore();

    ipcRenderer.on('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));
    ipcRenderer.on('snob:patch-history', (_e, history: SnobHistoryStore) => snobHistoryStore.$patch(history));
};