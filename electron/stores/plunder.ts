import { assertBoolean, assertFinite, assertInteger, assertString, isKeyOf, arrayIncludes } from '@tb-dev/ts-guard';
import { assertWallLevel } from '$electron/utils/guards.js';
import { ProxyStoreError } from '$electron/error.js';
import type { PlunderedAmount, BlindAttackPattern } from '$types/plunder.js';
import type { PlunderStore, PlunderConfigStore, PlunderFullHistoryStore } from '$types/stores.js';
import type { RemoveMethods } from '$types/utils.js';

class PlunderProxy implements RemoveMethods<PlunderStore> {
    hideAttacked: boolean = true;
    page: number = 0;
    pageSize: number = 15;
    plunderExhausted: boolean = false;
};

export function setPlunderProxy() {
    return new Proxy(new PlunderProxy(), {
        set(target, key, value) {
            if(!isKeyOf(key, target)) return false;
            return Reflect.set(target, key, value);
        }
    });
};

class PlunderConfigProxy implements RemoveMethods<PlunderConfigStore> {
    active: boolean = false;

    ignoreWall: boolean = false;
    wallLevelToIgnore: number = 1;

    destroyWall: boolean = false;
    wallLevelToDestroy: number = 1;

    groupAttack: boolean = false;
    useC: boolean = false;

    ignoreDelay: boolean = false;
    attackDelay: number = 200;

    blindAttack: boolean = false;
    blindAttackPattern: BlindAttackPattern = 'smaller';

    resourceRatio: number = 0.8;
    minutesUntilReload: number = 10;
};

export function setPlunderConfigProxy() {
    return new Proxy(new PlunderConfigProxy(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
    
            switch (key) {
                case 'wallLevelToIgnore':
                case 'wallLevelToDestroy':
                    assertWallLevel(value, ProxyStoreError);
                    break;
                case 'attackDelay':
                    assertInteger(value);
                    if (value < 100 || value > 5000) return false;
                    break;
                case 'blindAttackPattern':
                    assertString(value);
                    const patterns: BlindAttackPattern[] = ['smaller', 'bigger'];
                    if (!arrayIncludes(patterns, value)) return false;
                    break;
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

class PlunderHistoryProxy implements PlunderFullHistoryStore {
    private readonly base: PlunderedAmount = {
        wood: 0,
        stone: 0,
        iron: 0,
        total: 0,
        attackAmount: 0
    };

    private readonly handler: ProxyHandler<PlunderedAmount> = {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
            assertInteger(value);
            return Reflect.set(target, key, value);
        }
    };

    readonly last: PlunderedAmount = new Proxy({ ...this.base }, this.handler);
    readonly total: PlunderedAmount = new Proxy({ ...this.base }, this.handler);
};

export function setPlunderHistoryProxy() {
    return new PlunderHistoryProxy();
};

export type { PlunderProxy, PlunderConfigProxy, PlunderHistoryProxy };