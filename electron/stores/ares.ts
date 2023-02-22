import { assertStringOrNull, assertIntegerOrNull, assertBooleanOrNull, isString } from '@tb-dev/ts-guard';
import { ProxyStoreError } from '$electron/error.js';
import { assertWorldOrNull } from '$electron/utils/guards.js';
import type { AresStore } from '$types/stores.js';

import type { World } from '$types/game.js';
import type { RemoveMethods } from '$types/utils.js';

class AresProxy implements RemoveMethods<AresStore> {
    locale: string | null = null;
    world: World | null = null;
    majorVersion: string | null = null;
    groupId: number | null = null;
    
    screen: string | null = null;
    screenMode: string | null = null;
    pregame: boolean | null = null;
};

export function setAresProxy() {
    return new Proxy(new AresProxy(), {
        set(target, key, value) {
            if (!isString(key)) return false;

            switch (key) {
                case 'locale':
                case 'majorVersion':
                case 'screen':
                case 'screenMode':
                    assertStringOrNull(value);
                    break;
                case 'world':
                    assertWorldOrNull(value, ProxyStoreError);
                    break; 
                case 'groupId':
                    assertIntegerOrNull(value);
                    break;
                case 'pregame':
                    assertBooleanOrNull(value);
                    break;
                default:
                    throw new ProxyStoreError(`A propriedade \"${key}\" não existe no objeto Ares.`);
            };

            return Reflect.set(target, key, value);
        }
    });
};

export type { AresProxy };