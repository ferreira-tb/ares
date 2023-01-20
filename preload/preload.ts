import '$/prototype.js';
import { watch, createApp } from 'vue';
import { createPinia, storeToRefs } from 'pinia';
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
watch(currentScreen, (value) => {
    if (value === 'am_farm') loadFarmModule();
});

// Eventos.
setPreloadEvents(pinia);