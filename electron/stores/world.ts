import { assertInteger, assertBoolean, assertFinite, isKeyOf } from '@tb-dev/ts-guard';
import type { WorldConfigType, WorldUnitType, UnitDetails } from '$types/world.js';

class WorldConfigStore implements WorldConfigType {
    speed: number = 1;
    unitSpeed: number = 1;
    tradeCancelTime: number = 300;
    commandCancelTime: number = 600;
    archer: boolean = false;
    church: boolean = false;
    watchtower: boolean = false;
};

function setWorldConfigStore() {
    return new Proxy(new WorldConfigStore(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;

            switch (key) {
                case 'speed':
                    assertFinite(value);
                    break;
                case 'unitSpeed':
                    assertFinite(value);
                    break;
                case 'tradeCancelTime':
                    assertInteger(value);
                    break;
                case 'commandCancelTime':
                    assertInteger(value);
                    break;
                case 'archer':
                    assertBoolean(value);
                    break;
                case 'church':
                    assertBoolean(value);
                    break;
                case 'watchtower':
                    assertBoolean(value);
                    break;
            };

            return Reflect.set(target, key, value);
        }
    });
};

class WorldUnitStore implements WorldUnitType {
    private readonly base: UnitDetails = {
        buildTime: 0,
        pop: 0,
        speed: 0,
        attack: 0,
        defense: 0,
        defenseCavalry: 0,
        defenseArcher: 0,
        carry: 0
    };

    private readonly handler: ProxyHandler<UnitDetails> = {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;

            if (key === 'speed') {
                assertFinite(value);
            } else {
                assertInteger(value);
            };
            
            return Reflect.set(target, key, value);
        }
    };

    readonly spear = new Proxy({ ...this.base }, this.handler);
    readonly sword = new Proxy({ ...this.base }, this.handler);
    readonly axe = new Proxy({ ...this.base }, this.handler);
    readonly spy = new Proxy({ ...this.base }, this.handler);
    readonly light = new Proxy({ ...this.base }, this.handler);
    readonly heavy = new Proxy({ ...this.base }, this.handler);
    readonly knight = new Proxy({ ...this.base }, this.handler);
    readonly archer = new Proxy({ ...this.base }, this.handler);
    readonly marcher = new Proxy({ ...this.base }, this.handler);
    readonly ram = new Proxy({ ...this.base }, this.handler);
    readonly catapult = new Proxy({ ...this.base }, this.handler);
    readonly snob = new Proxy({ ...this.base }, this.handler);
    readonly militia = new Proxy({ ...this.base }, this.handler);
};

function setWorldUnitStore() {
    return new WorldUnitStore();
};

export type { WorldConfigStore, WorldUnitStore };
export { setWorldConfigStore, setWorldUnitStore };