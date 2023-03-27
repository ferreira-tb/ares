import { Deimos } from '$deimos/shared/ipc';
import { PlunderError } from '$browser/error';
import { usePlunderStore } from '$vue/stores/plunder';
import { ipcSend } from '$global/ipc';

export async function getPlunderInfo() {
    try {
        const plunderInfo = await Deimos.invoke('get-plunder-info');
        if (!plunderInfo) throw new PlunderError('Não foi possível obter os dados do assistente de saque.');
        
        const plunderStore = usePlunderStore();
        plunderStore.$patch(plunderInfo);
        
        ipcSend('update-plunder-info', plunderInfo);
    } catch (err) {
        PlunderError.catch(err);
    };
};