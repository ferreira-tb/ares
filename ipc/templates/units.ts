import { assertString, isString } from '$common/guards';

interface MaybeNotArcherWorld extends Omit<UnitsAmountAsStrings, 'archer' | 'marcher'> {
    archer?: string;
    marcher?: string;
};

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

    constructor(units: MaybeNotArcherWorld) {
        for (const unit of Object.keys(units)) {
            assertString(unit, 'Invalid unit name');
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
        this.archer = isString(units.archer) ? units.archer.toIntegerStrict() : 0;
        this.marcher = isString(units.marcher) ? units.marcher.toIntegerStrict() : 0;
    };
};