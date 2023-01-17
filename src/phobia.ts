/*import './assets/style.css';
import { createApp, watchEffect } from 'vue';
import { createPinia, storeToRefs } from 'pinia';
import { ipcRenderer } from 'electron';
import { router, routeNames } from '@/router/router.js';
import { useCurrentScreen } from '@/composables/game.js';
import { usePhobiaStore } from '@/stores/store.js';
import { assert } from '@/error.js';
import App from './App.vue';

const app = createApp(App)
const pinia = createPinia();

const phobiaStore = usePhobiaStore();
const { currentURL } = storeToRefs(phobiaStore);

// Plugins.
app.use(pinia);
app.use(router);

// Rotas.
const currentScreen = useCurrentScreen();
watchEffect(() => {
    if (currentScreen.value && routeNames.has(currentScreen.value)) {
        router.push({ name: currentScreen.value });
    } else {
        router.push('/');
    };
});

// Comunicação.
ipcRenderer.on('game-url', (_e, url) => {
    assert(typeof url === 'string', 'A URL é inválida.');
    currentURL.value = url;
});

app.mount('#app');*/

import './assets/style.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { router } from '@/router/router.js';
import App from './App.vue';

const app = createApp(App)
const pinia = createPinia();

// Plugins.
app.use(pinia);
app.use(router);

router.push('/');
app.mount('#app');