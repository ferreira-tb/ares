import '$windows/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$windows/router';
import { setWindowEvents } from '$windows/events';
import { RendererProcessError } from '$renderer/error';
import { ipcSend } from '$renderer/ipc';
import App from '$windows/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    RendererProcessError.catch(err);
};

// Eventos
setWindowEvents();

window.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    e.stopPropagation();
    ipcSend('window:show-context-menu', {
        x: e.clientX,
        y: e.clientY
    });
});

router.push('/')
    .then(() => app.mount('#app'))
    .catch((err: unknown) => RendererProcessError.catch(err));
