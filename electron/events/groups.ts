import { ipcMain } from 'electron';
import { useGroupsStore } from '$interface/index';

export function setGroupsEvents() {
    const groupsStore = useGroupsStore();

    ipcMain.handle('get-village-groups', () => groupsStore.all);
};