import { ref } from 'mechanus';

export function defineUnitsStore(mechanus: Mechanus) {
    return mechanus.define('units', () => {
        const spear = ref<number>(0);
        const sword = ref<number>(0);
        const axe = ref<number>(0);
        const archer = ref<number>(0);
        const spy = ref<number>(0);
        const light = ref<number>(0);
        const marcher = ref<number>(0);
        const heavy = ref<number>(0);
        const ram = ref<number>(0);
        const catapult = ref<number>(0);
        const knight = ref<number>(0);
        const snob = ref<number>(0);
        const militia = ref<number>(0);

        return {
            spear,
            sword,
            axe,
            archer,
            spy,
            light,
            marcher,
            heavy,
            ram,
            catapult,
            knight,
            snob,
            militia
        } satisfies MechanusUnitsStoreType;
    });
};