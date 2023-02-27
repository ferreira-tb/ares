import { assertWallLevel } from '$electron/utils/guards.js';
import { ProxyStoreError } from '$electron/error.js';
import type { PlunderAttackDetails, BlindAttackPattern, UseCPattern } from '$types/plunder.js';
import type { PlunderStore, PlunderConfigStore, PlunderFullHistoryStore } from '$types/stores.js';
import type { RemoveMethods } from '$types/utils.js';
import type { WallLevel } from '$types/game.js';

import {
    assertBoolean,
    isKeyOf,
    arrayIncludes,
    assertPositiveInteger,
    assertPositiveNumber
} from '@tb-dev/ts-guard';

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
    destroyWall: boolean = false;
    groupAttack: boolean = false;
    useC: boolean = false;
    ignoreDelay: boolean = false;
    blindAttack: boolean = false;

    wallLevelToIgnore: WallLevel = 1;
    wallLevelToDestroy: WallLevel = 1;
    destroyWallMaxDistance: number = 20;
    attackDelay: number = 200;
    resourceRatio: number = 0.8;
    minutesUntilReload: number = 10;
    maxDistance: number = 20;
    ignoreOlderThan: number = 10;

    blindAttackPattern: BlindAttackPattern = 'smaller';
    useCPattern: UseCPattern = 'normal';
};

// Patterns.
export const blindAttackPatterns: BlindAttackPattern[] = ['smaller', 'bigger'];
export const useCPatterns: UseCPattern[] = ['normal', 'only'];

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
                    assertPositiveInteger(value);
                    if (value < 100 || value > 5000) return false;
                    break;
                case 'resourceRatio':
                    assertPositiveNumber(value);
                    if (value < 0.2 || value > 1) return false;
                    break;
                case 'minutesUntilReload':
                    assertPositiveInteger(value);
                    if (value > 60) return false;
                    break;
                case 'maxDistance':
                case 'destroyWallMaxDistance':
                    assertPositiveNumber(value);
                    if (value < 1) return false;
                    break;
                case 'ignoreOlderThan':
                    assertPositiveInteger(value);
                    break;

                case 'blindAttackPattern':
                    if (!arrayIncludes(blindAttackPatterns, value)) return false;
                    break;
                case 'useCPattern':
                    if (!arrayIncludes(useCPatterns, value)) return false;
                    break;
                    
                default:
                    assertBoolean(value);
            };
    
            return Reflect.set(target, key, value);
        }
    });
};

class PlunderHistoryProxy implements PlunderFullHistoryStore {
    private readonly base: PlunderAttackDetails = {
        wood: 0,
        stone: 0,
        iron: 0,
        total: 0,
        destroyedWalls: 0,
        attackAmount: 0
    };

    private readonly handler: ProxyHandler<PlunderAttackDetails> = {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
            assertPositiveInteger(value);
            return Reflect.set(target, key, value);
        }
    };

    readonly last: PlunderAttackDetails = new Proxy({ ...this.base }, this.handler);
    readonly total: PlunderAttackDetails = new Proxy({ ...this.base }, this.handler);
};

export function setPlunderHistoryProxy() {
    return new PlunderHistoryProxy();
};

export type { PlunderProxy, PlunderConfigProxy, PlunderHistoryProxy };