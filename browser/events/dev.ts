import { ipcRenderer } from 'electron';
import { DOMAssertionError } from '@tb-dev/ts-guard-dom';
import { AresError } from '$global/error';

export function setDevEvents() {
    ipcRenderer.on('emit-mock-error', () => {
        const err = new AresError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });

    ipcRenderer.on('emit-mock-dom-error', () => {
        const err = new DOMAssertionError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });
};