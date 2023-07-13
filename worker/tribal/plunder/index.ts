import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { Mechanus } from 'mechanus';
import { ipcInvoke, ipcOn } from '$renderer/ipc';
import { IpcTribal } from '$ipc/interface';
import { TribalWorkerError } from '$worker/error';
import { defineGameDataStore, definePlunderConfigStore } from '$common/stores';

const mechanus = new Mechanus();
const configStore = definePlunderConfigStore(mechanus)(() => {
    return ipcInvoke('plunder:get-config');
});

// IpcTribal não estará carregado ainda?
const gameDataStore = defineGameDataStore(mechanus)(() => {
    return IpcTribal.invoke('ipc-tribal:game-data');
});

ipcOn('plunder:patch-config', (_e, config: PlunderConfigType) => {
    try {
        configStore.$patch(config);
    } catch (err) {
        TribalWorkerError.catch(err);
    }
});

async function plunder() {
    /** Tabela do assistente de saque. */
    const plunderList = document.querySelector('#plunder_list:has(tr[id^="village"]) tbody');
}

window.addEventListener('DOMContentLoaded', plunder, { once: true });