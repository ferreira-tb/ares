import { ipcMain } from 'electron';
import { isInteger } from '@tb-dev/ts-guard';
import { isWorld } from '$electron/utils/guards';
import { MainProcessEventError } from '$electron/error';
import { extractWorldUnitsFromMap } from '$electron/utils/helpers';
import { useCacheStore, WorldUnit, worldUnitsMap } from '$electron/interface';
import { setPlunderGroupEvents } from '$electron/events/plunder/group';
import { setPlunderPageEvents } from '$electron/events/plunder/page';
import { setPlunderConfigEvents } from '$electron/events/plunder/config';
import { setPlunderAttackEvents } from '$electron/events/plunder/attack';
import type { UnitAmount, World } from '$types/game';
import type { WorldUnitType } from '$types/world';

export function setPlunderEvents() {
    const cacheStore = useCacheStore();
    
    // Calcula a capacidade de carga de um determinado conjunto de unidades.
    ipcMain.handle('calc-carry-capacity', async (_e, units: Partial<UnitAmount>, world?: World | null) => {
        try {
            world ??= cacheStore.world;
            if (!isWorld(world)) return null;

            let worldUnits: WorldUnitType;
            if (world === cacheStore.world) {       
                worldUnits = extractWorldUnitsFromMap(worldUnitsMap);
            } else {
                const worldUnitsRow = await WorldUnit.findByPk(world);
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
    setPlunderAttackEvents();
};