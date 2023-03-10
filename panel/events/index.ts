import { ipcRenderer } from 'electron';
import { useAresStore } from '$vue/stores/ares.js';
import { useFeaturesStore } from '$vue/stores/features.js';
import { usePlayerStore } from '$vue/stores/player.js';
import { useCurrentVillageStore } from '$vue/stores/village.js';
import { useUnitsStore } from '$vue/stores/units.js';
import { setPlunderEvents } from '$panel/events/plunder.js';
import { setPhobosEvents } from '$panel/events/phobos.js';
import type { TribalWarsGameDataType, UnitAmount } from '$types/game.js';

export function setPanelEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();

    ipcRenderer.on('patch-panel-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
    });
    
    ipcRenderer.on('patch-panel-current-village-units', (_e, units: UnitAmount) => unitStore.$patch(units));

    setPlunderEvents();
    setPhobosEvents();
};