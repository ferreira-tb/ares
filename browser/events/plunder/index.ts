import { ipcOn } from '$renderer/ipc';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { setPlunderNavigationEvents } from '$browser/events/plunder/navigation';

export function setPlunderEvents() {
    setPlunderNavigationEvents();

    const plunderConfigStore = usePlunderConfigStore();

    ipcOn('plunder:stop', () => (plunderConfigStore.active = false));
    ipcOn('plunder:patch-config', (_e, config: PlunderConfigType) => plunderConfigStore.$patch(config));
};