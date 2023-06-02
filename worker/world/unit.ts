import { TribalWorkerError } from '$worker/error';

class EachUnit implements UnitDetails {
    readonly buildTime: number;
    readonly pop: number;
    readonly speed: number;
    readonly attack: number;
    readonly defense: number;
    readonly defenseCavalry: number;
    readonly defenseArcher: number;
    readonly carry: number;

    constructor(element: Element) {
        const buildTime = element.queryAndAssert('build_time');
        this.buildTime = buildTime.parseIntStrict();

        const pop = element.queryAndAssert('pop');
        this.pop = pop.parseIntStrict();

        const speed = element.queryAndAssert('speed');
        this.speed = speed.parseFloatStrict();

        const attack = element.queryAndAssert('attack');
        this.attack = attack.parseIntStrict();

        const defense = element.queryAndAssert('defense');
        this.defense = defense.parseIntStrict();

        const defenseCavalry = element.queryAndAssert('defense_cavalry');
        this.defenseCavalry = defenseCavalry.parseIntStrict();

        const defenseArcher = element.queryAndAssert('defense_archer');
        this.defenseArcher = defenseArcher.parseIntStrict();

        const carry = element.queryAndAssert('carry');
        this.carry = carry.parseIntStrict();
    };
};

class WorldUnits implements WorldUnitsType {
    readonly spear: EachUnit;
    readonly sword: EachUnit;
    readonly axe: EachUnit;
    readonly archer: EachUnit | null;
    readonly spy: EachUnit;
    readonly light: EachUnit;
    readonly marcher: EachUnit | null;
    readonly heavy: EachUnit;
    readonly ram: EachUnit;
    readonly catapult: EachUnit;
    readonly knight: EachUnit;
    readonly snob: EachUnit;
    readonly militia: EachUnit;

    constructor() {
        this.spear = new EachUnit(document.queryAndAssert('spear'));
        this.sword = new EachUnit(document.queryAndAssert('sword'));
        this.axe = new EachUnit(document.queryAndAssert('axe'));
        this.spy = new EachUnit(document.queryAndAssert('spy'));
        this.light = new EachUnit(document.queryAndAssert('light'));
        this.heavy = new EachUnit(document.queryAndAssert('heavy'));
        this.ram = new EachUnit(document.queryAndAssert('ram'));
        this.catapult = new EachUnit(document.queryAndAssert('catapult'));
        this.knight = new EachUnit(document.queryAndAssert('knight'));
        this.snob = new EachUnit(document.queryAndAssert('snob'));
        this.militia = new EachUnit(document.queryAndAssert('militia'));

        const archer = document.querySelector('archer');
        this.archer = archer ? new EachUnit(archer) : null;

        const marcher = document.querySelector('marcher');
        this.marcher = marcher ? new EachUnit(marcher) : null;
    };
};

export function fetchWorldUnit(port: MessagePort) {
    try {
        const worldUnit = new WorldUnits();
        port.postMessage(worldUnit);

    } catch (err) {
        TribalWorkerError.catch(err);
        port.postMessage(null);
        
    } finally {
        port.close();
    };
};