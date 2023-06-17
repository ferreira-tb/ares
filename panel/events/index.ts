import { setPlunderEvents } from '$panel/events/plunder';
import { setSnobEvents } from '$panel/events/snob';
import { ipcOn } from '$renderer/ipc';
import {
    useAresStore,
    useFeaturesStore,
    usePlayerStore,
    useCurrentVillageStore,
    useUnitsStore
} from '$renderer/stores';

export function setPanelEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();

    ipcOn('captcha:did-update-status', (_e, thereIsCaptcha: boolean) => {
        aresStore.captcha = thereIsCaptcha;
    });

    ipcOn('game:patch-current-village-units', (_e, units: UnitAmount) => {
        unitStore.$patch(units);
    });

    ipcOn('game:patch-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
    });

    setPlunderEvents();
    setSnobEvents();
};