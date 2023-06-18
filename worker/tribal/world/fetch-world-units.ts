import '@tb-dev/prototype';
import '@tb-dev/prototype-dom';
import { ipcOn } from '$renderer/ipc';
import { TribalWorkerError } from '$worker/error';

ipcOn('port', (e) => {
    const port = e.ports[0];
    port.onmessageerror = TribalWorkerError.onMessageError;

    fetchWorldUnits(port);
});

class EachUnit implements UnitDetails {
    public readonly buildTime: number;
    public readonly pop: number;
    public readonly speed: number;
    public readonly attack: number;
    public readonly defense: number;
    public readonly defenseCavalry: number;
    public readonly defenseArcher: number;
    public readonly carry: number;

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
    public readonly spear: EachUnit;
    public readonly sword: EachUnit;
    public readonly axe: EachUnit;
    public readonly archer: EachUnit | null;
    public readonly spy: EachUnit;
    public readonly light: EachUnit;
    public readonly marcher: EachUnit | null;
    public readonly heavy: EachUnit;
    public readonly ram: EachUnit;
    public readonly catapult: EachUnit;
    public readonly knight: EachUnit;
    public readonly snob: EachUnit;
    public readonly militia: EachUnit;

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

function fetchWorldUnits(port: MessagePort) {
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