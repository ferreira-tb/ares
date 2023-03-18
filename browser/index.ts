import '$browser/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$browser/router/router';
import { setBrowserEvents } from '$browser/events/index';
import { BrowserError } from '$browser/error';
import { ipcSend } from '$global/ipc';
import { getResponseTime } from '$global/utils/helpers';
import { gameURLRegex } from '$global/utils/constants';
import Browser from '$browser/Browser.vue';

const app = createApp(Browser);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = BrowserError.catch;
router.onError(BrowserError.catch);

// Eventos.
setBrowserEvents(pinia);

window.addEventListener('DOMContentLoaded', () => {
    router.push('/');
    const ares = document.createElement('ares');
    app.mount(ares);

    // Envia o tempo de resposta para o processo principal.
    if (gameURLRegex.test(location.href)) {
        const responseTime = getResponseTime();
        ipcSend('update-response-time', responseTime);
    };
}, { once: true });