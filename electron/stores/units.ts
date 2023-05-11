import { ref } from 'mechanus';
import { integerRef } from '$electron/utils/mechanus';

export function defineUnitsStore(mechanus: Mechanus) {
    return mechanus.define('units', {
        archer: ref<number>(0, integerRef),
        axe: ref<number>(0, integerRef),
        light: ref<number>(0, integerRef),
        marcher: ref<number>(0, integerRef),
        ram: ref<number>(0, integerRef),
        spear: ref<number>(0, integerRef),
        spy: ref<number>(0, integerRef),
        sword: ref<number>(0, integerRef),
        heavy: ref<number>(0, integerRef),
        catapult: ref<number>(0, integerRef),
        knight: ref<number>(0, integerRef),
        snob: ref<number>(0, integerRef),
        militia: ref<number>(0, integerRef)
    } satisfies MechanusUnitsStoreType);
};