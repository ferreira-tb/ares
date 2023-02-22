import { assertInteger, assertBoolean, assertFinite, isKeyOf } from '@tb-dev/ts-guard';
import type { WorldConfigStore, WorldUnitStore } from '$types/stores.js';
import type { UnitDetails } from '$types/world.js';
import type { RemoveMethods } from '$types/utils.js';

class WorldConfigProxy implements RemoveMethods<WorldConfigStore> {
    speed: number = 1;
    unitSpeed: number = 1;
    tradeCancelTime: number = 300;
    commandCancelTime: number = 600;
    archer: boolean = false;
    church: boolean = false;
    watchtower: boolean = false;
};

export function setWorldConfigProxy() {
    return new Proxy(new WorldConfigProxy(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;

            switch (key) {
                case 'speed':
                case 'unitSpeed':
                    assertFinite(value);
                    break;
                case 'tradeCancelTime':
                case 'commandCancelTime':
                    assertInteger(value);
                    break;
                case 'archer':
                case 'church':
                case 'watchtower':
                    assertBoolean(value);
                    break;
            };

            return Reflect.set(target, key, value);
        }
    });
};

class WorldUnitProxy implements RemoveMethods<WorldUnitStore> {
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

export function setWorldUnitProxy() {
    return new WorldUnitProxy();
};

export type { WorldConfigProxy, WorldUnitProxy };