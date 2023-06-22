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
        const buildTime = element.queryStrict('build_time');
        this.buildTime = buildTime.parseIntStrict();

        const pop = element.queryStrict('pop');
        this.pop = pop.parseIntStrict();

        const speed = element.queryStrict('speed');
        this.speed = speed.parseFloatStrict();

        const attack = element.queryStrict('attack');
        this.attack = attack.parseIntStrict();

        const defense = element.queryStrict('defense');
        this.defense = defense.parseIntStrict();

        const defenseCavalry = element.queryStrict('defense_cavalry');
        this.defenseCavalry = defenseCavalry.parseIntStrict();

        const defenseArcher = element.queryStrict('defense_archer');
        this.defenseArcher = defenseArcher.parseIntStrict();

        const carry = element.queryStrict('carry');
        this.carry = carry.parseIntStrict();
    }
}

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
        this.spear = new EachUnit(document.queryStrict('spear'));
        this.sword = new EachUnit(document.queryStrict('sword'));
        this.axe = new EachUnit(document.queryStrict('axe'));
        this.spy = new EachUnit(document.queryStrict('spy'));
        this.light = new EachUnit(document.queryStrict('light'));
        this.heavy = new EachUnit(document.queryStrict('heavy'));
        this.ram = new EachUnit(document.queryStrict('ram'));
        this.catapult = new EachUnit(document.queryStrict('catapult'));
        this.knight = new EachUnit(document.queryStrict('knight'));
        this.snob = new EachUnit(document.queryStrict('snob'));
        this.militia = new EachUnit(document.queryStrict('militia'));

        const archer = document.querySelector('archer');
        this.archer = archer ? new EachUnit(archer) : null;

        const marcher = document.querySelector('marcher');
        this.marcher = marcher ? new EachUnit(marcher) : null;
    }
}

function fetchWorldUnits(port: MessagePort) {
    try {
        const worldUnit = new WorldUnits();
        port.postMessage(worldUnit);

    } catch (err) {
        TribalWorkerError.catch(err);
        port.postMessage(null);
        
    } finally {
        port.close();
    }
}