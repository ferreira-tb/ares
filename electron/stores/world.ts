import { ref } from 'mechanus';
import { finiteNumberRef, integerRef, booleanRef } from '$electron/utils/mechanus';
import { allUnits } from '$electron/utils/constants';
import type { AllUnits } from '$types/game';
import type { UnitDetails } from '$types/world';
import type { Mechanus, MechanusStore } from 'mechanus';

export function defineWorldConfigStore(mechanus: Mechanus) {
    return mechanus.define('worldConfig', {
        speed: ref(1, finiteNumberRef),
        unitSpeed: ref(1, finiteNumberRef),
        tradeCancelTime: ref(300, integerRef),
        commandCancelTime: ref(600, integerRef),
        archer: ref(false, booleanRef),
        church: ref(false, booleanRef),
        watchtower: ref(false, booleanRef)
    });
};

export function createWorldUnitStoresMap(mechanus: Mechanus) {
    const worldUnitMap = new Map<AllUnits, () => MechanusStore<UnitDetails>>();
    allUnits.forEach((unit) => {
        worldUnitMap.set(unit, mechanus.define(`worldUnit-${unit}`, {
            buildTime: ref(0, integerRef),
            pop: ref(0, integerRef),
            speed: ref(0, finiteNumberRef),
            attack: ref(0, integerRef),
            defense: ref(0, integerRef),
            defenseCavalry: ref(0, integerRef),
            defenseArcher: ref(0, integerRef),
            carry: ref(0, integerRef)
        }));
    });

    return worldUnitMap as ReadonlyMap<AllUnits, () => MechanusStore<UnitDetails>>;
};