import '$windows/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '$windows/router';
import { setModuleEvents } from '$windows/events';
import { ModuleError } from '$windows/error';
import App from '$windows/App.vue';

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
