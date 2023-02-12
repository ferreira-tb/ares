import 'vuetify/styles';
import '$global/assets/style.css';
import '$global/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { router } from '$panel/router/router.js';
import { setChildWindowEvents } from '$panel/events.js';
import { AresError } from '$global/error.js';
import Panel from '$panel/Panel.vue';

const panel = createApp(Panel);
const pinia = createPinia();
const vuetify = createVuetify({
    defaults: {
        VBtn: {
            variant: 'tonal'
        },
        VTooltip: {
            activator: 'parent',
            location: 'bottom'
        }
    }
});

// Plugins.
panel.use(pinia);
panel.use(router);
panel.use(vuetify);

// Error handler.
panel.config.errorHandler = AresError.handle;

// Eventos.
setChildWindowEvents(pinia);

router.push('/');
panel.mount('#app');