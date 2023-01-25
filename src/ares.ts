import '@/assets/style.css';
import '$/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import { setChildWindowEvents } from '@/events.js';
import { ClaustrophobicError } from '@/error.js';
import App from '@/App.vue';

const childApp = createApp(App);
const pinia = createPinia();

// Plugins.
childApp.use(pinia);
childApp.use(router);

// Error handler.
childApp.config.errorHandler = ClaustrophobicError.handle;

// Eventos.
setChildWindowEvents(pinia);

router.push('/');
childApp.mount('#app');