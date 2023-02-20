import '$global/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { router } from '$modules/router/router.js';
import { setModuleEvents } from '$modules/events.js';
import { ModuleError } from '$modules/error.js';
import App from '$modules/App.vue';

const app = createApp(App);
const pinia = createPinia();
const vuetify = createVuetify({
    defaults: {
        VBtn: {
            variant: 'tonal'
        },
        VCard: {
            variant: 'tonal'
        },
        VTooltip: {
            activator: 'parent',
            location: 'bottom'
        }
    }
});

// Plugins.
app.use(pinia);
app.use(router);
app.use(vuetify);

// Error handler.
app.config.errorHandler = ModuleError.catch;

// Eventos
setModuleEvents();

router.push('/');
app.mount('#app');