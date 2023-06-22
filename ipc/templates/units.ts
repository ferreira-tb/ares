import { assertString, isString } from '$common/guards';
import { Units } from '$common/templates';

interface MaybeNotArcherWorld extends Omit<UnitsAmountAsStrings, 'archer' | 'marcher'> {
    archer?: string;
    marcher?: string;
};

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

    constructor(units: MaybeNotArcherWorld) {
        super();
        
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