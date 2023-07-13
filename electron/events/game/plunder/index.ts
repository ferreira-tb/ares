import { ipcMain } from 'electron';
import { ref, storeToRefs, watchImmediate } from 'mechanus';
import { isInteger, isWorld } from '$common/guards';
import { MainProcessError } from '$electron/error';
import { useCacheStore } from '$electron/stores';
import { WorldUnits } from '$electron/database/models';
import { setPlunderGroupEvents } from '$electron/events/game/plunder/group';
import { setPlunderPageEvents } from '$electron/events/game/plunder/page';
import { setPlunderConfigEvents } from '$electron/events/game/plunder/config';
import { setPlunderHistoryEvents } from '$electron/events/game/plunder/history';
import { setPlunderDemolitionEvents } from '$electron/events/game/plunder/demolition';
import { setPlunderTemplatesEvents } from '$electron/events/game/plunder/templates';

export function setPlunderEvents() {
    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('plunder:calc-carry-capacity', calcCarryCapacityHandler());

    setPlunderConfigEvents();
    setPlunderPageEvents();
    setPlunderGroupEvents();
    setPlunderHistoryEvents();
    setPlunderDemolitionEvents();
    setPlunderTemplatesEvents();
}

function calcCarryCapacityHandler() {
    const cacheStore = useCacheStore();
    const { world: cachedWorld } = storeToRefs(cacheStore);

    const currentWorldUnitsInfo = ref<WorldUnitsType | null>(null);
    watchImmediate(cachedWorld, async (world) => {
        if (!isWorld(world)) {
            currentWorldUnitsInfo.value = null;
            return;
        }

        const row = await WorldUnits.findByPk(world);
        currentWorldUnitsInfo.value = row?.toJSON() ?? null;
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
                const row = await WorldUnits.findByPk(world);
                if (!row) return null;
                units = row.toJSON();
            }
            
            const entries = Object.entries(unitsToCheck) as [keyof UnitAmount, number][];
            return entries.reduce((carryCapacity, [unitName, amount]) => {
                const unitCapacity = units[unitName]?.carry;
                if (isInteger(unitCapacity)) carryCapacity += unitCapacity * amount;
                return carryCapacity;
            }, 0);

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        }
    };
}