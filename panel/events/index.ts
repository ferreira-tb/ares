import { ipcRenderer } from 'electron';
import { useAresStore } from '$global/stores/ares';
import { useFeaturesStore } from '$global/stores/features';
import { usePlayerStore } from '$global/stores/player';
import { useCurrentVillageStore } from '$global/stores/village';
import { useUnitsStore } from '$global/stores/units';
import { useGroupsStore } from '$global/stores/groups';
import { setPlunderEvents } from '$panel/events/plunder';
import type { TribalWarsGameDataType, UnitAmount, VillageGroup } from '$types/game';

export function setPanelEvents() {
    const aresStore = useAresStore();
    const featuresStore = useFeaturesStore();
    const playerStore = usePlayerStore();
    const currentVillageStore = useCurrentVillageStore();
    const unitStore = useUnitsStore();
    const groupsStore = useGroupsStore();

    ipcRenderer.on('patch-panel-game-data', (_e, data: TribalWarsGameDataType) => {
        aresStore.$patch(data.ares);
        featuresStore.$patch(data.features);
        playerStore.$patch(data.player);
        currentVillageStore.$patch(data.currentVillage);
        groupsStore.$patch(data.groups);
    });
    
    ipcRenderer.on('patch-panel-current-village-units', (_e, units: UnitAmount) => {
        unitStore.$patch(units);
    });
    
    ipcRenderer.on('patch-panel-village-groups-set', (_e, groups: Set<VillageGroup>) => {
        groupsStore.$patch({ all: groups });
    });

    setPlunderEvents();
};