import '$panel/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$panel/router/router';
import { setPanelEvents } from '$panel/events/index';
import { PanelError } from '$panel/error';
import Panel from '$panel/Panel.vue';

const panel = createApp(Panel);
const pinia = createPinia();

// Plugins.
panel.use(pinia);
panel.use(router);

// Error handler.
panel.config.errorHandler = PanelError.catch;

// Eventos.
setPanelEvents();

router.push('/');
panel.mount('#app');