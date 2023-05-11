import { ipcRenderer } from 'electron';
import { usePanelStore } from '$panel/stores/panel';
import { useAresStore } from '$renderer/stores/ares';
import { useFeaturesStore } from '$renderer/stores/features';
import { usePlayerStore } from '$renderer/stores/player';
import { useCurrentVillageStore } from '$renderer/stores/village';
import { useUnitsStore } from '$renderer/stores/units';
import { useGroupsStore } from '$renderer/stores/groups';
import { setPlunderEvents } from '$panel/events/plunder';

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
    
    ipcRenderer.on('panel:patch-village-groups-set', (_e, groups: Set<VillageGroup>) => {
        groupsStore.$patch({ all: groups });
    });

    setPlunderEvents();
};