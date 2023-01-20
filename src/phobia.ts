import '@/assets/style.css';
import '$/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import { patchPlunderStore } from '@/stores/plunder.js';
import { setChildWindowEvents } from '@/events.js';
import { ClaustrophobicError } from '@/error.js';
import App from '@/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Atribui as configurações salvas.
patchPlunderStore(pinia)
    .catch((err: unknown) => ClaustrophobicError.handle(err));

// Eventos.
setChildWindowEvents(pinia);

router.push('/');
app.mount('#app');