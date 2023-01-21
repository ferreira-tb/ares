import '@/assets/style.css';
import '$/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import { patchPlunderStore } from '@/stores/plunder.js';
import { setChildWindowEvents } from '@/events.js';
import { ClaustrophobicError } from '@/error.js';
import App from '@/App.vue';

const childApp = createApp(App);
const pinia = createPinia();

// Plugins.
childApp.use(pinia);
childApp.use(router);

// Atribui as configurações salvas.
patchPlunderStore()
    .catch((err: unknown) => ClaustrophobicError.handle(err));

// Eventos.
setChildWindowEvents(pinia);

router.push('/');
childApp.mount('#app');