import { isKeyOf, isString, assertStringOrNull, assertIntegerOrNull } from '@tb-dev/ts-guard';
import type { User as UserTable } from '$tables/user.js';
import type { PlayerStore } from '$types/stores.js';
import type { RemoveMethods } from '$types/utils.js';

class PlayerProxy implements RemoveMethods<PlayerStore> {
    name: string | null = null;
    id: number | null = null;
    points: number | null = null;
    villageAmount: number | null = null;
};

export function setPlayerProxy(User: typeof UserTable) {
    return new Proxy(new PlayerProxy(), {
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;

            switch (key) {
                case 'name':
                    assertStringOrNull(value, 'O valor não é uma string ou nulo.');
                    if (isString(value)) {
                        const previous = Reflect.get(target, key);
                        if (previous !== value) User.savePlayerAsUser(value);
                    };
                    break;
                case 'id':
                case 'points':
                case 'villageAmount':
                    assertIntegerOrNull(value, 'O valor não é um inteiro ou nulo.');
                    break;
            };
            
            return Reflect.set(target, key, value);
        }
    });
};

export type { PlayerProxy };