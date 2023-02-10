import '$global/assets/style.css';
import '$global/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from './router/router.js';
import { setModuleEvents } from './events.js';
import { AresError } from '$global/error.js';
import App from './App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = AresError.handle;

// Eventos
setModuleEvents();

router.push('/');
app.mount('#app');