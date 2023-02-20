import '$global/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVuetify } from 'vuetify';
import { router } from '$panel/router/router.js';
import { setPanelWindowEvents } from '$panel/events.js';
import { PanelError } from '$panel/error.js';
import Panel from '$panel/Panel.vue';

const panel = createApp(Panel);
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
panel.use(pinia);
panel.use(router);
panel.use(vuetify);

// Error handler.
panel.config.errorHandler = PanelError.catch;

// Eventos.
setPanelWindowEvents(pinia);

router.push('/');
panel.mount('#app');