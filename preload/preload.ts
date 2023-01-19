import '$/prototype.js';
import { watch, createApp } from 'vue';
import { createPinia, storeToRefs } from 'pinia';
import { supportedScreens } from '@/constants.js';
import { loadFarmModule } from '$/farm/farm.js';
import { setPreloadEvents } from '$/events.js';
import { usePhobiaStore } from '@/stores/store.js';
import Preload from '$/Preload.vue';

const mainApp = createApp(Preload);
export const pinia = createPinia();

// Plugins.
mainApp.use(pinia);

// Janela.
const phobiaStore = usePhobiaStore(pinia);
const { currentScreen } = storeToRefs(phobiaStore);
const unwatch = watch(currentScreen, (value) => {
    if (!value || !supportedScreens.includes(value)) return;
    if (value === 'am_farm') loadFarmModule();
    unwatch();
});

// Eventos.
setPreloadEvents(pinia);