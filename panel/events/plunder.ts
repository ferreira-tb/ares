import { usePlunderStore, usePlunderHistoryStore, usePlunderConfigStore } from '$renderer/stores';
import { ipcOn } from '$renderer/ipc';

export function setPlunderEvents() {
    const plunderStore = usePlunderStore();
    const plunderConfigStore = usePlunderConfigStore();
    const plunderHistoryStore = usePlunderHistoryStore();

    ipcOn('plunder:stop', () => (plunderConfigStore.active = false));

    ipcOn('plunder:patch-info', (_e, info: PlunderInfoType) => plunderStore.$patch(info));
    ipcOn('plunder:patch-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
    ipcOn('plunder:patch-history', (_e, history: PlunderHistoryType) => plunderHistoryStore.$patch(history));
};