import { ipcRenderer } from 'electron';
import { AresError } from '$global/error';
import { ipcInvoke } from '$global/ipc';

export function setDevEvents() {
    // A callback desse evento varia conforme o que está sendo testado no momento.
    ipcRenderer.on('its-dev-magic', async () => {
        const isDev = await ipcInvoke('is-dev');
        if (!isDev) return;
        console.log('It\'s dev magic!');
        
        const err = new AresError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });

    ipcRenderer.on('emit-mock-error', () => {
        const err = new AresError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });
};