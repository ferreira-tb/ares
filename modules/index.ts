import '$modules/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$modules/router';
import { setModuleEvents } from '$modules/events';
import { ModuleError } from '$modules/error';
import App from '$modules/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    ModuleError.catch(err);
};

// Eventos
setModuleEvents();

router.push('/')
    .then(() => app.mount('#app'))
    .catch((err: unknown) => ModuleError.catch(err));
