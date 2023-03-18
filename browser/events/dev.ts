import { ipcRenderer } from 'electron';
import { DOMAssertionError } from '@tb-dev/ts-guard-dom';
import { AresError } from '$global/error';
import { ipcInvoke } from '$global/ipc';

export function setDevEvents() {
    ipcRenderer.on('its-dev-magic', async () => {
        const isDev = await ipcInvoke('is-dev');
        if (!isDev) return;
        console.log('It\'s dev magic!');
        
        const previous = document.querySelector('#bot_check[ares="test"]');
        if (previous) {
            previous.remove();
        } else {
            const botCheck = document.createElement('div');
            botCheck.setAttribute('id', 'bot_check');
            botCheck.setAttribute('ares', 'test');
    
            const content = document.queryAndAssert('table#contentContainer');
            content.appendChild(botCheck);
        };
    });

    ipcRenderer.on('emit-mock-error', () => {
        const err = new AresError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });

    ipcRenderer.on('emit-mock-dom-error', () => {
        const err = new DOMAssertionError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        AresError.catch(err);
    });
};