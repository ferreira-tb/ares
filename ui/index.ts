import '$ui/assets/main.scss';
import '$global/prototype';
import '$renderer/prototype';
import { createApp } from 'vue';
import { MainWindowError } from '$ui/error';
import App from '$ui/App.vue';

const app = createApp(App);

// Error handler.
app.config.errorHandler = (err: unknown) => {
    MainWindowError.catch(err);
};

app.mount('#app');