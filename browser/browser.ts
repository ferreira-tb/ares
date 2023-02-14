import '$browser/assets/style.css';
import '$global/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$browser/router/router.js';
import { setBrowserEvents } from '$browser/events.js';
import { AresError, GameDOMError } from '$global/error.js';
import Browser from '$browser/Browser.vue';

const app = createApp(Browser);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err) => {
    if (err instanceof GameDOMError) {
        GameDOMError.handle(err);
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