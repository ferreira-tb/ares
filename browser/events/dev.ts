import { RendererProcessError } from '$renderer/error';
import { ipcInvoke, ipcOn } from '$renderer/ipc';

export async function setDevEvents() {
    const isDev = await ipcInvoke('app:is-dev');
    if (!isDev) return;
    
    // A callback desse evento varia conforme o que está sendo testado no momento.
    ipcOn('dev:magic', () => {
        console.log('It\'s dev magic!');
        mockRendererProcessError();
    });

    ipcOn('dev:mock-captcha', () => mockCaptcha());
    ipcOn('dev:mock-error', () => mockRendererProcessError());
};

function mockCaptcha() {
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
};

function mockRendererProcessError() {
    const err = new RendererProcessError('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
    RendererProcessError.catch(err);
};