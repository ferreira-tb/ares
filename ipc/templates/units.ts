import { isString } from 'lodash-es';
import { Units } from '$common/templates';

export class GameUnits extends Units {
    public override readonly spear: number;
    public override readonly sword: number;
    public override readonly axe: number;
    public override readonly spy: number;
    public override readonly light: number;
    public override readonly heavy: number;
    public override readonly knight: number;
    public override readonly ram: number;
    public override readonly catapult: number;
    public override readonly snob: number;
    public override readonly militia: number;

    public override readonly archer: number;
    public override readonly marcher: number;

    constructor(units: PartialKeys<{ [K in AllUnits]: string }, 'archer' | 'marcher'>) {
        super();

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
        this.archer = isString(units.archer) ? units.archer.toIntegerStrict() : 0;
        this.marcher = isString(units.marcher) ? units.marcher.toIntegerStrict() : 0;
    }
}