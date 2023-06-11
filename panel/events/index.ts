import { ipcRenderer } from 'electron';
import { usePanelStore } from '$panel/stores';
import { setPlunderEvents } from '$panel/events/plunder';
import { setSnobEvents } from '$panel/events/snob';
import {
    useAresStore,
    useFeaturesStore,
    usePlayerStore,
    useCurrentVillageStore,
    useUnitsStore
} from '$renderer/stores';

export function setPanelEvents() {
    const panelStore = usePanelStore();
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();

    ipcRenderer.on('captcha:did-update-status', (_e, thereIsCaptcha: boolean) => {
        aresStore.captcha = thereIsCaptcha;
    });

    ipcRenderer.on('game:patch-current-village-units', (_e, units: UnitAmount) => {
        unitStore.$patch(units);
    });

    ipcRenderer.on('game:patch-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
    });

    ipcRenderer.on('panel:visibility-did-change', (_e, isVisible: boolean) => {
        panelStore.isVisible = isVisible;
    });

    setPlunderEvents();
    setSnobEvents();
};