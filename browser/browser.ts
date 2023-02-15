import '$browser/assets/style.css';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { DOMAssertionError } from '@tb-dev/ts-guard-dom';
import { router } from '$browser/router/router.js';
import { setBrowserEvents } from '$browser/events.js';
import { AresError } from '$global/error.js';
import Browser from '$browser/Browser.vue';

const app = createApp(Browser);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err) => {
    if (err instanceof DOMAssertionError) {
        AresError.handleDOMError(err);
    } else {
        AresError.handle(err);
    };
};

// Eventos.
setBrowserEvents(pinia);

window.addEventListener('DOMContentLoaded', () => {
    router.push('/');
    const ares = document.createElement('ares');
    app.mount(ares);
}, { once: true });