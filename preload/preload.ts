import { ref, watch, createApp } from 'vue';
import { createPinia } from 'pinia';
import { useCurrentScreen } from '@/composables/game.js';
import { gameURL } from '@/constants.js';
import { supportedScreens } from '@/constants.js';
import { loadFarmModule } from '$/farm/farm.js';
import { setPreloadEvents } from '$/events.js';
import Preload from '$/Preload.vue';

const mainApp = createApp(Preload);
const pinia = createPinia();

// Plugins.
mainApp.use(pinia);

// Janela.
export const currentURL = ref<string>(gameURL);
export const currentScreen = useCurrentScreen(currentURL);
const unwatch = watch(currentURL, () => {
    if (!currentScreen.value || !supportedScreens.includes(currentScreen.value)) return;
    
    unwatch();
    if (currentScreen.value === 'am_farm') loadFarmModule();
});

// Eventos.
setPreloadEvents(pinia);