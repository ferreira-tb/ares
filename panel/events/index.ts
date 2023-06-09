import { ipcRenderer } from 'electron';
import { usePanelStore } from '$panel/stores';
import { setPlunderEvents } from '$panel/events/plunder';
import { setSnobEvents } from '$panel/events/snob';
import {
    useAresStore,
    useFeaturesStore,
    usePlayerStore,
    useCurrentVillageStore,
    useUnitsStore,
    useGroupsStore
} from '$renderer/stores';

export function setPanelEvents() {
    const panelStore = usePanelStore();
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();
    const groupsStore = useGroupsStore();

    ipcRenderer.on('captcha:status-did-update', (_e, thereIsCaptcha: boolean) => {
        aresStore.captcha = thereIsCaptcha;
    });

    ipcRenderer.on('game:patch-village-groups-set', (_e, groups: Set<VillageGroup>) => {
        groupsStore.$patch({ all: groups });
    });

    ipcRenderer.on('panel:visibility-did-change', (_e, isVisible: boolean) => {
        panelStore.isVisible = isVisible;
    });

    ipcRenderer.on('panel:patch-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
        groupsStore.$patch(data.groups);
    });
    
    ipcRenderer.on('panel:patch-current-village-units', (_e, units: UnitAmount) => {
        unitStore.$patch(units);
    });

    setPlunderEvents();
    setSnobEvents();
};