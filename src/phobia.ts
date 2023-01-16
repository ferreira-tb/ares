import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import App from './App.vue';

import './assets/style.css';

const app = createApp(App)
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

router.push('/');
app.mount('#app');