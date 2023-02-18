import { isString } from '@tb-dev/ts-guard';
import { generateUserAlias } from '$electron/utils/helpers.js';
import { isUserAlias } from '$electron/utils/guards.js';
import type { CacheStoreType, UserAlias } from '$types/electron.js';
import type { SetStoreState } from '$interface/interface.js';

class CacheStore implements CacheStoreType {
    world: string | null = null;
    player: string | null = null;
    userAlias: UserAlias | null = null;
};

function setCacheStore(setStoreState: typeof SetStoreState) {
    return new Proxy(new CacheStore(), {
        set(target, key, value, receiver) {
            if (value === null) return true;

            // Obtém do target para que a trap "get" não seja acionada.
            const previousAlias = Reflect.get(target, 'userAlias') as UserAlias | null;
            // Obtém do receiver (proxy) para que a trap "get" seja acionada.
            const alias = Reflect.get(receiver, 'userAlias') as UserAlias | null;

            if (isUserAlias(alias) && alias !== previousAlias) {
                setStoreState(alias);
                Reflect.set(target, 'userAlias', alias);
            };

            return Reflect.set(target, key, value);
        },
        get(target, key) {
            if (key === 'userAlias') {
                console.log('world:', target.world, 'player:', target.player);
                if (!isString(target.player) || !isString(target.world)) return null;
                return generateUserAlias(target.world, target.player);
            };

            return Reflect.get(target, key);
        }
    });
};

export type { CacheStore };
export { setCacheStore };