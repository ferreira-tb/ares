import '$browser/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router, setNavigationGuards } from '$browser/router';
import { setBrowserEvents } from '$browser/events';
import { BrowserError } from '$browser/error';
import { ipcSend } from '$renderer/ipc';
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

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ipcSend('browser:show-context-menu');
});