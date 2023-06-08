import { ref } from 'mechanus';
import { finiteNumberRef, integerRef, booleanRef } from '$electron/utils/mechanus';
import { allUnits } from '$common/constants';

export function defineWorldConfigStore(mechanus: Mechanus) {
    return mechanus.define('world-config', {
        speed: ref(1, finiteNumberRef),
        unitSpeed: ref(1, finiteNumberRef),
        tradeCancelTime: ref(300, integerRef),
        commandCancelTime: ref(600, integerRef),
        archer: ref(false, booleanRef),
        church: ref(false, booleanRef),
        watchtower: ref(false, booleanRef)
    } satisfies MechanusWorldConfigStoreType);
};

export function createWorldUnitStoresMap(mechanus: Mechanus) {
    const worldUnitMap = new Map<AllUnits, () => MechanusStore<UnitDetails>>();
    allUnits.forEach((unit) => {
        worldUnitMap.set(unit, mechanus.define(`world-unit-${unit}`, {
            buildTime: ref(0, integerRef),
            pop: ref(0, integerRef),
            speed: ref(0, finiteNumberRef),
            attack: ref(0, integerRef),
            defense: ref(0, integerRef),
            defenseCavalry: ref(0, integerRef),
            defenseArcher: ref(0, integerRef),
            carry: ref(0, integerRef)
        } satisfies MechanusWorldUnitStoreType));
    });

    return worldUnitMap as WorldUnitStoresMap;
};