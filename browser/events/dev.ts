/* eslint-disable no-console */
import { RendererProcessError } from '$renderer/error';
import { ipcInvoke, ipcSend, ipcOn } from '$renderer/ipc';

export function setDevEvents() {
    ipcInvoke('app:is-dev').then((isDev) => {
        if (!isDev) return;

        ipcOn('dev:magic', () => {
            ipcSend('dev:magic');
        });

        ipcOn('dev:mock-captcha', () => mockCaptcha());
        ipcOn('dev:mock-error', () => mockRendererProcessError());
    });
}

function mockCaptcha() {
    const previous = document.querySelector('#bot_check[ares="test"]');
    if (previous) {
        previous.remove();
    } else {
        const botCheck = document.createElement('div');
        botCheck.setAttribute('id', 'bot_check');
        botCheck.setAttribute('ares', 'test');

        const content = document.queryStrict('table#contentContainer');
        content.appendChild(botCheck);
    }
}

function mockRendererProcessError() {
    const err = new RendererProcessError('This is a mock error.');
    RendererProcessError.catch(err);
}