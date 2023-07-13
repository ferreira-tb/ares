import '$browser/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { setBrowserEvents } from '$browser/events';
import { BrowserError } from '$browser/error';
import { ipcSend } from '$renderer/ipc';
import App from '$browser/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    BrowserError.catch(err);
};

// Eventos.
setBrowserEvents();

function mount() {
    const ares = document.createElement('ares');
    app.mount(ares);
}

window.addEventListener('DOMContentLoaded', mount, { once: true });

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    ipcSend('browser:show-context-menu', {
        x: e.clientX,
        y: e.clientY
    });
});