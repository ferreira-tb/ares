import '$/assets/style.css';
import '#/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$/router/router.js';
import { setPreloadEvents } from '$/events.js';
import { ClaustrophobicError, GameDOMError } from '#/error.js';
import Game from '$/Game.vue';

const mainApp = createApp(Game);
const pinia = createPinia();

// Plugins.
mainApp.use(pinia);
mainApp.use(router);

// Error handler.
mainApp.config.errorHandler = (err) => {
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
    mainApp.mount(ares);
}, { once: true });