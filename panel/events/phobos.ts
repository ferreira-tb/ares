import { ipcRenderer } from 'electron';
import { storeToRefs } from 'pinia';
import { ipcSend } from '$global/ipc.js';
import { usePanelStore } from '$panel/stores/panel.js';

export function setPhobosEvents() {
    const store = usePanelStore();
    const { phobosWorkerPort } = storeToRefs(store);

    ipcRenderer.on('port', (e) => {
        phobosWorkerPort.value = e.ports[0];
        phobosWorkerPort.value.onmessage = onWorkerMessage;
    });

    ipcRenderer.on('did-override-phobos-worker', () => {
        if (phobosWorkerPort.value) {
            phobosWorkerPort.value.onmessage = null;
            phobosWorkerPort.value.close();
            phobosWorkerPort.value = null;
        };

        ipcSend('phobos-worker-port-is-gone');
    });
};

function onWorkerMessage() {

};