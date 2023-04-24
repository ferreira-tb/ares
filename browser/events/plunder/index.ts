import { ipcRenderer } from 'electron';
import { usePlunderConfigStore } from '$renderer/stores/plunder';
import { setPlunderConfigEvents } from '$browser/events/plunder/config';
import { setPlunderNavigationEvents } from '$browser/events/plunder/navigation';

export function setPlunderEvents() {
    setPlunderConfigEvents();
    setPlunderNavigationEvents();

    const plunderConfigStore = usePlunderConfigStore();

    ipcRenderer.on('plunder:stop', () => (plunderConfigStore.active = false));
};