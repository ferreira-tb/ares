import { ipcRenderer } from 'electron';
import { useSnobConfigStore } from '$renderer/stores';

export function setSnobEvents() {
    const snobConfigStore = useSnobConfigStore();

    ipcRenderer.on('snob:patch-config', (_e, config: SnobConfigType) => snobConfigStore.$patch(config));
};