import { assertString, toCustom, isString } from '@tb-dev/ts-guard';
import type { UnitAmount, UnitsAmountAsStrings } from '$types/game';

export class Units implements UnitAmount {
    public readonly spear: number;
    public readonly sword: number;
    public readonly axe: number;
    public readonly spy: number;
    public readonly light: number;
    public readonly heavy: number;
    public readonly knight: number;
    public readonly ram: number;
    public readonly catapult: number;
    public readonly snob: number;
    public readonly militia: number;

    public readonly archer: number;
    public readonly marcher: number;

    constructor(units: UnitsAmountAsStrings) {
        for (const unit in units) {
            assertString(unit);
        };

        this.spear = units.spear.toIntegerStrict();
        this.sword = units.sword.toIntegerStrict();
        this.axe = units.axe.toIntegerStrict();
        this.spy = units.spy.toIntegerStrict();
        this.light = units.light.toIntegerStrict();
        this.heavy = units.heavy.toIntegerStrict();
        this.knight = units.knight.toIntegerStrict();
        this.ram = units.ram.toIntegerStrict();
        this.catapult = units.catapult.toIntegerStrict();
        this.snob = units.snob.toIntegerStrict();
        this.militia = units.militia.toIntegerStrict();

        // Serão undefined em mundos sem arqueiros.
        this.archer = toCustom(units.archer, '0', isString).toIntegerStrict();
        this.marcher = toCustom(units.marcher, '0', isString).toIntegerStrict();
    };
};