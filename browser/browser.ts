import '$/assets/style.css';
import '#/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$/router/router.js';
import { setPreloadEvents } from '$/events.js';
import { ClaustrophobicError, GameDOMError } from '#/error.js';
import Browser from '$/Browser.vue';

const app = createApp(Browser);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err) => {
    if (err instanceof GameDOMError) {
        GameDOMError.reportDOMError(err);
    } else {
        ClaustrophobicError.handle(err);
    };
};

// Eventos.
setPreloadEvents(pinia);

window.addEventListener('DOMContentLoaded', () => {
    router.push('/');
    const ares = document.createElement('ares');
    app.mount(ares);
}, { once: true });