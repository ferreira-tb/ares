import 'vuetify/styles';
import '$global/assets/style.css';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { router } from '$modules/router/router.js';
import { setModuleEvents } from '$modules/events.js';
import { AresError } from '$global/error.js';
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
app.config.errorHandler = AresError.catch;

// Eventos
setModuleEvents();

router.push('/');
app.mount('#app');