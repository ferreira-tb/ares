import '#/assets/style.css';
import '#/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router/router.js';
import { setChildWindowEvents } from './events.js';
import { AresError } from '#/error.js';
import Panel from './Panel.vue';

const panel = createApp(Panel);
const pinia = createPinia();

// Plugins.
panel.use(pinia);
panel.use(router);

// Error handler.
panel.config.errorHandler = AresError.handle;

// Eventos.
setChildWindowEvents(pinia);

router.push('/');
panel.mount('#app');