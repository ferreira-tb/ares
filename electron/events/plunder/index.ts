import { ipcMain } from 'electron';
import { isInteger } from '$global/guards';
import { isWorld } from '$global/guards';
import { MainProcessEventError } from '$electron/error';
import { extractWorldUnitsFromMap } from '$electron/utils/helpers';
import { useCacheStore, WorldUnits, worldUnitsMap } from '$electron/interface';
import { setPlunderGroupEvents } from '$electron/events/plunder/group';
import { setPlunderPageEvents } from '$electron/events/plunder/page';
import { setPlunderConfigEvents } from '$electron/events/plunder/config';
import { setPlunderHistoryEvents } from '$electron/events/plunder/history';
import { setPlunderDemolitionEvents } from '$electron/events/plunder/demolition';
import { setPlunderTemplatesEvents } from '$electron/events/plunder/templates';

export function setPlunderEvents() {
    const cacheStore = useCacheStore();
    
    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('plunder:calc-carry-capacity', async (_e, units: Partial<UnitAmount>, world?: World | null) => {
        try {
            world ??= cacheStore.world;
            if (!isWorld(world)) return null;

            let worldUnits: WorldUnitsType;
            if (world === cacheStore.world) {
                worldUnits = extractWorldUnitsFromMap(worldUnitsMap);
            } else {
                const worldUnitsRow = await WorldUnits.findByPk(world);
                if (!worldUnitsRow) return null;
                worldUnits = worldUnitsRow.toJSON();
            };
            
            const entries = Object.entries(units) as [keyof UnitAmount, number][];
            return entries.reduce((carryCapacity, [unit, amount]) => {
                const unitCapacity = worldUnits[unit]?.carry;
                if (isInteger(unitCapacity)) carryCapacity += unitCapacity * amount;
                return carryCapacity;
            }, 0);

        } catch (err) {
            MainProcessEventError.catch(err);
            return null;
        };
    });

    setPlunderConfigEvents();
    setPlunderPageEvents();
    setPlunderGroupEvents();
    setPlunderHistoryEvents();
    setPlunderDemolitionEvents();
    setPlunderTemplatesEvents();
};