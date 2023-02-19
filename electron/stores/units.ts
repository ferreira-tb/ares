import { assertInteger, isKeyOf } from '@tb-dev/ts-guard';
import type { UnitAmount } from '$types/game.js';

class UnitStore implements UnitAmount {
    archer: number = 0;
    axe: number = 0;
    light: number = 0;
    marcher: number = 0;
    ram: number = 0;
    spear: number = 0;
    spy: number = 0;
    sword: number = 0;
    heavy: number = 0;
    catapult: number = 0;
    knight: number = 0;
    snob: number = 0;
    militia: number = 0;
};

function setUnitStore() {
    return new Proxy(new UnitStore(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
            assertInteger(value, 'Valor não é um inteiro.');
            return Reflect.set(target, key, value);
        }
    });
};

export type { UnitStore };
export { setUnitStore };