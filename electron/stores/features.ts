import { assertBooleanOrNull, isKeyOf } from '@tb-dev/ts-guard';
import type { FeaturesStore } from '$types/stores.js';
import type { RemoveMethods } from '$types/utils.js';

class FeaturesProxy implements RemoveMethods<FeaturesStore> {
    premium: boolean | null = null;
    accountManager: boolean | null = null;
    farmAssistant: boolean | null = null;
};

export function setFeaturesProxy() {
    return new Proxy(new FeaturesProxy(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
            assertBooleanOrNull(value, 'O valor não é um booleano ou nulo.');
            return Reflect.set(target, key, value);
        }
    });
};

export type { FeaturesProxy };