import { ref } from 'mechanus';
import { allUnits } from '$common/constants';

export function defineWorldConfigStore(mechanus: Mechanus) {
    return mechanus.define('world-config', {
        speed: ref(1),
        unitSpeed: ref(1),
        tradeCancelTime: ref(300),
        commandCancelTime: ref(600),
        archer: ref(false),
        church: ref(false),
        watchtower: ref(false)
    } satisfies MechanusWorldConfigStoreType);
};

export function createWorldUnitStoresMap(mechanus: Mechanus) {
    const worldUnitMap = new Map<AllUnits, () => MechanusStore<UnitDetails>>();
    allUnits.forEach((unit) => {
        worldUnitMap.set(unit, mechanus.define(`world-unit-${unit}`, {
            buildTime: ref(0),
            pop: ref(0),
            speed: ref(0),
            attack: ref(0),
            defense: ref(0),
            defenseCavalry: ref(0),
            defenseArcher: ref(0),
            carry: ref(0)
        } satisfies MechanusWorldUnitStoreType));
    });

    return worldUnitMap as WorldUnitStoresMap;
};