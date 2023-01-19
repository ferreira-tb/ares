import '@/assets/style.css';
import '$/prototype.js';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import { setChildWindowSavedState } from '@/stores/store.js';
import App from '@/App.vue';

const app = createApp(App);
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Atribui as configurações salvas.
setChildWindowSavedState();

router.push('/');
app.mount('#app');