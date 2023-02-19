import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { UnitAmount } from '$types/game.js';

/** Unidades na aldeia atual. */
export const useUnitStore = defineStore('unit', () => {
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

    function toRaw(): UnitAmount {
        return {
            spear: spear.value,
            sword: sword.value,
            axe: axe.value,
            archer: archer.value,
            spy: spy.value,
            light: light.value,
            marcher: marcher.value,
            heavy: heavy.value,
            ram: ram.value,
            catapult: catapult.value,
            knight: knight.value,
            snob: snob.value,
            militia: militia.value
        };
    };

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
        militia,
        toRaw
    };
});