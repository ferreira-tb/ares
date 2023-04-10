import { ipcRenderer } from 'electron';
import { RendererProcessError } from '$renderer/error';

export function setDevEvents(isDev: boolean) {
    if (!isDev) return;
    
    // A callback desse evento varia conforme o que está sendo testado no momento.
    ipcRenderer.on('its-dev-magic', () => {
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
        const err = new RendererProcessError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
        RendererProcessError.catch(err);
    });
};