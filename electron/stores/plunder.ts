import { assertBoolean, assertFinite, assertInteger } from '@tb-dev/ts-guard';
import type { PlunderStoreType } from '$types/electron.js';
import type { PlunderConfigType, PlunderHistoryType, PlunderedAmount } from '$types/plunder.js';

class PlunderStore implements PlunderStoreType {
    hideAttacked: boolean = true;
    page: number = 0;
    pageSize: number = 15;
    plunderExhausted: boolean = false;
};

function setPlunderStore() {
    return new Proxy(new PlunderStore(), {
        set(target, key, value) {
            if (key in target) return Reflect.set(target, key, value);
            return false;
        }
    });
};

class PlunderConfigStore implements PlunderConfigType {
    active: boolean = false;
    ignoreWall: boolean = false;
    destroyWall: boolean = false;
    groupAttack: boolean = false;
    useC: boolean = false;
    ignoreDelay: boolean = false;
    blindAttack: boolean = false;
    resourceRatio: number = 0.8;
    minutesUntilReload: number = 10;
};

function setPlunderConfigStore() {
    return new Proxy(new PlunderConfigStore(), {
        set(target, key, value) {
            if (!(key in target)) return false;
    
            switch (key) {
                case 'resourceRatio':
                    assertFinite(value);
                    if (value < 0.2 || value > 1) return false;
                    break;
                case 'minutesUntilReload':
                    assertInteger(value);
                    if (value < 1 || value > 60) return false;
                    break;
                default:
                    assertBoolean(value);
            };
    
            return Reflect.set(target, key, value);
        }
    });
};

class PlunderHistoryStore implements PlunderHistoryType {
    private readonly base: PlunderedAmount = {
        wood: 0,
        stone: 0,
        iron: 0,
        total: 0,
        attackAmount: 0
    };

    private readonly handler: ProxyHandler<PlunderedAmount> = {
        set(target, key, value) {
            if (key in target) {
                assertInteger(value);
                return Reflect.set(target, key, value);
            };

            return false;
        }
    };

    readonly last: PlunderedAmount = new Proxy({ ...this.base }, this.handler);
    readonly total: PlunderedAmount = new Proxy({ ...this.base }, this.handler);
};

function setPlunderHistoryStore() {
    return new PlunderHistoryStore();
};

export type { PlunderStore, PlunderConfigStore, PlunderHistoryStore };
export { setPlunderStore, setPlunderConfigStore, setPlunderHistoryStore };