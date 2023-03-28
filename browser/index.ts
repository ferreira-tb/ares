import '$browser/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$browser/router/router';
import { setNavigationGuards } from '$browser/router/guards/index';
import { setBrowserEvents } from '$browser/events/index';
import { BrowserError } from '$browser/error';
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
setNavigationGuards(router);

window.addEventListener('DOMContentLoaded', () => {
    router.push('/');
    const ares = document.createElement('ares');
    app.mount(ares);
}, { once: true });