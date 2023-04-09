import '$ui/assets/main.scss';
import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import { MainWindowError } from '$ui/error';
import App from '$ui/App.vue';

const app = createApp(App);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    MainWindowError.catch(err);
};

app.mount('#app');