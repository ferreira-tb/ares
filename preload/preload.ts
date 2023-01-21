import '$/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$/router/router.js';
import { setPreloadEvents } from '$/events.js';
import Preload from '$/Preload.vue';

const mainApp = createApp(Preload);
const pinia = createPinia();

// Plugins.
mainApp.use(pinia);
mainApp.use(router);

// Eventos.
setPreloadEvents(pinia);

window.addEventListener('DOMContentLoaded', () => {
    router.push('/');
    const claustrophobia = document.createElement('claustrophobia');
    mainApp.mount(claustrophobia);
}, { once: true });