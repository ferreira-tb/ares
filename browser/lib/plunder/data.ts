import { Deimos } from '$deimos/interface/ipc';
import { PlunderError } from '$browser/error';
import { usePlunderStore, usePlunderConfigStore } from '$renderer/stores/plunder';
import { ipcInvoke } from '$renderer/ipc';

export async function getPlunderInfo() {
    try {
        const plunderInfo = await Deimos.invoke('get-plunder-info');
        if (!plunderInfo) throw new PlunderError('Could not get plunder info.');
        
        const plunderStore = usePlunderStore();
        plunderStore.$patch(plunderInfo);
        
        const updated = await ipcInvoke('update-plunder-info', plunderInfo);
        if (!updated) throw new PlunderError('Could not update plunder info.');
    } catch (err) {
        PlunderError.catch(err);
    };
};

export async function updatePlunderConfig() {
    const plunderConfigStore = usePlunderConfigStore();
    const previousConfig = await ipcInvoke('plunder:get-config');
    if (previousConfig) plunderConfigStore.$patch(previousConfig);
};