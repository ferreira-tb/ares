import { ipcOn } from '$renderer/ipc';
import { useSnobConfigStore, useSnobHistoryStore } from '$renderer/stores';

export function setSnobEvents() {
    const snobConfigStore = useSnobConfigStore();
    const snobHistoryStore = useSnobHistoryStore();

    ipcOn('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));
    ipcOn('snob:patch-history', (_e, history: SnobHistoryType) => snobHistoryStore.$patch(history));
};