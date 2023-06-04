import '$ui/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { MainWindowError } from '$ui/error';
import { setUIEvents } from '$ui/events';
import App from '$ui/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    MainWindowError.catch(err);
};

// Eventos.
setUIEvents();

app.mount('#app');