import { IpcTribal } from '$ipc/interface/ipc';
import { PlunderError } from '$browser/error';
import { ipcInvoke } from '$renderer/ipc';
import { usePlunderStore, usePlunderConfigStore } from '$renderer/stores';

export async function getPlunderInfo() {
    try {
        const plunderInfo = await IpcTribal.invoke('ipc-tribal:plunder-info');
        if (!plunderInfo) throw new PlunderError('Could not get plunder info.');
        
        const plunderStore = usePlunderStore();
        plunderStore.$patch(plunderInfo);
        
        const updated = await ipcInvoke('ipc-tribal:update-plunder-info', plunderInfo);
        if (!updated) throw new PlunderError('Could not update plunder info.');
    } catch (err) {
        PlunderError.catch(err);
    }
}

export async function updatePlunderConfig() {
    const plunderConfigStore = usePlunderConfigStore();
    const previousConfig = await ipcInvoke('plunder:get-config');
    if (previousConfig) plunderConfigStore.$patch(previousConfig);
}