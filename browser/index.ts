import '$browser/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$browser/router/router';
import { setNavigationGuards } from '$browser/router/guards/index';
import { setBrowserEvents } from '$browser/events/index';
import { BrowserError } from '$browser/error';
import App from '$browser/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    BrowserError.catch(err);
};

// Eventos.
setBrowserEvents();
setNavigationGuards(router);

window.addEventListener('DOMContentLoaded', async () => {
    try {
        await router.push('/');
        const ares = document.createElement('ares');
        app.mount(ares);
    } catch (err) {
        BrowserError.catch(err);
    };
}, { once: true });