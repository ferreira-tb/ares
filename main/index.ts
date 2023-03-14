import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { createApp } from 'vue';
import App from '$main/App.vue';

const app = createApp(App);
app.mount('#app');