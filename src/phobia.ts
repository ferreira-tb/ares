import './assets/style.css';
import { createApp, watchEffect } from 'vue';
import { createPinia } from 'pinia';
import { router, routeNames } from '@/router/router.js';
import { useCurrentScreen } from '@/composables/game.js';
import App from './App.vue';

const app = createApp(App)
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

// Rotas.
const currentScreen = useCurrentScreen();
watchEffect(() => {
    if (currentScreen.value && routeNames.has(currentScreen.value)) {
        router.push({ name: currentScreen.value });
    } else {
        router.push({ name: 'home' });
    };
});

app.mount('#app');