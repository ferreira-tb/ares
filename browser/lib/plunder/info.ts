import { assertObject } from '@tb-dev/ts-guard';
import { Deimos } from '$deimos/shared/ipc.js';
import { PlunderError } from '$browser/error.js';
import { usePlunderStore } from '$vue/stores/plunder.js';
import { ipcSend } from '$global/ipc.js';

export async function getPlunderInfo() {
    try {
        const plunderInfo = await Deimos.invoke('get-plunder-info');
        assertObject(plunderInfo, 'O objeto de informações do Plunder é inválido.');

        const plunderStore = usePlunderStore();
        plunderStore.$patch(plunderInfo);
        
        ipcSend('update-plunder-info', plunderInfo);
    } catch (err) {
        PlunderError.catch(err);
    };
};