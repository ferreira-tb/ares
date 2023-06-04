import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import '$panel/assets/main.scss';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$panel/router';
import { setPanelEvents } from '$panel/events/index';
import { PanelError } from '$panel/error';
import App from '$panel/App.vue';

const panel = createApp(App);
const pinia = createPinia();

// Plugins.
panel.use(pinia);
panel.use(router);

// Error handler.
panel.config.errorHandler = (err: unknown) => {
    PanelError.catch(err);
};

// Eventos.
setPanelEvents();

router.push('/')
    .then(() => panel.mount('#app'))
    .catch(PanelError.catch);
