import { assertObject } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc';
import { PlunderError } from '$browser/error';
import { usePlunderStore } from '$vue/stores/plunder';
import { ipcSend } from '$global/ipc';

export async function getPlunderInfo() {
    try {
        const plunderInfo = await Deimos.invoke('get-plunder-info');
        assertObject(plunderInfo, 'Não foi possível obter as informações do Plunder.');

        const plunderStore = usePlunderStore();
        plunderStore.$patch(plunderInfo);
        
        ipcSend('update-plunder-info', plunderInfo);
    } catch (err) {
        PlunderError.catch(err);
    };
};