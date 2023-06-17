import { ipcMain } from 'electron';
import { ref, storeToRefs, watch, watchImmediate } from 'mechanus';
import { isInteger, isWorld } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { useAresStore, useCacheStore, usePlunderCacheStore } from '$electron/stores';
import { WorldUnits } from '$electron/database/models';
import { setPlunderGroupEvents } from '$electron/events/game/plunder/group';
import { setPlunderPageEvents } from '$electron/events/game/plunder/page';
import { setPlunderConfigEvents } from '$electron/events/game/plunder/config';
import { setPlunderHistoryEvents } from '$electron/events/game/plunder/history';
import { setPlunderDemolitionEvents } from '$electron/events/game/plunder/demolition';
import { setPlunderTemplatesEvents } from '$electron/events/game/plunder/templates';

export function setPlunderEvents() {
    const aresStore = useAresStore();
    const { screen } = storeToRefs(aresStore);

    const plunderCacheStore = usePlunderCacheStore();
    const { pages: plunderPages, plunderGroup } = storeToRefs(plunderCacheStore);

    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('plunder:calc-carry-capacity', calcCarryCapacityHandler());

    watch(screen, (newScreen) => {
        if (newScreen !== 'am_farm') {
            if (plunderPages.value) plunderPages.value = null;
            if (plunderGroup.value) plunderGroup.value = null;
        };
    });

    setPlunderConfigEvents();
    setPlunderPageEvents();
    setPlunderGroupEvents();
    setPlunderHistoryEvents();
    setPlunderDemolitionEvents();
    setPlunderTemplatesEvents();
};

function calcCarryCapacityHandler() {
    const cacheStore = useCacheStore();
    const { world: cachedWorld } = storeToRefs(cacheStore);

    const currentWorldUnitsInfo = ref<WorldUnitsType | null>(null);
    watchImmediate(cachedWorld, async (world) => {
        if (!isWorld(world)) {
            currentWorldUnitsInfo.value = null;
            return;
        };

        const worldUnitsRow = await WorldUnits.findByPk(world);
        currentWorldUnitsInfo.value = worldUnitsRow?.toJSON() ?? null;
    });

    return async function(_e: unknown, unitsToCheck: Partial<UnitAmount>, world?: World | null) {
        try {
            world ??= cachedWorld.value;
            if (!isWorld(world)) return null;

            let units: WorldUnitsType;
            if (world === cachedWorld.value) {
                if (!currentWorldUnitsInfo.value) return null;
                units = currentWorldUnitsInfo.value;
            } else {
                const worldUnitsRow = await WorldUnits.findByPk(world);
                if (!worldUnitsRow) return null;
                units = worldUnitsRow.toJSON();
            };
            
            const entries = Object.entries(unitsToCheck) as [keyof UnitAmount, number][];
            return entries.reduce((carryCapacity, [unit, amount]) => {
                const unitCapacity = units[unit]?.carry;
                if (isInteger(unitCapacity)) carryCapacity += unitCapacity * amount;
                return carryCapacity;
            }, 0);

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        };
    };
};