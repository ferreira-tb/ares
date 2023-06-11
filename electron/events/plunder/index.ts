import { ipcMain } from 'electron';
import { ref, storeToRefs, watchImmediate } from 'mechanus';
import { isInteger, isWorld } from '$common/guards';
import { MainProcessEventError } from '$electron/error';
import { useCacheStore, WorldUnits } from '$electron/interface';
import { setPlunderGroupEvents } from '$electron/events/plunder/group';
import { setPlunderPageEvents } from '$electron/events/plunder/page';
import { setPlunderConfigEvents } from '$electron/events/plunder/config';
import { setPlunderHistoryEvents } from '$electron/events/plunder/history';
import { setPlunderDemolitionEvents } from '$electron/events/plunder/demolition';
import { setPlunderTemplatesEvents } from '$electron/events/plunder/templates';

export function setPlunderEvents() {
    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('plunder:calc-carry-capacity', calcCarryCapacityHandler());

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
            MainProcessEventError.catch(err);
            return null;
        };
    };
};