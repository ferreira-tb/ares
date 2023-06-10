import { ref } from 'mechanus';

export function defineUnitsStore(mechanus: Mechanus) {
    return mechanus.define('units', {
        archer: ref<number>(0),
        axe: ref<number>(0),
        light: ref<number>(0),
        marcher: ref<number>(0),
        ram: ref<number>(0),
        spear: ref<number>(0),
        spy: ref<number>(0),
        sword: ref<number>(0),
        heavy: ref<number>(0),
        catapult: ref<number>(0),
        knight: ref<number>(0),
        snob: ref<number>(0),
        militia: ref<number>(0)
    } satisfies MechanusUnitsStoreType);
};