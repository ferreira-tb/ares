import { isString } from '@tb-dev/ts-guard';
import { generateUserAlias } from '$electron/utils/helpers.js';
import { isUserAlias, isWorld } from '$electron/utils/guards.js';
import type { CacheStoreType, UserAlias } from '$types/electron.js';
import type { SetAliasStoreState, SetWorldStoreState } from '$interface/interface.js';
import type { World } from '$types/game.js';

class CacheStore implements CacheStoreType {
    world: World | null = null;
    player: string | null = null;
    userAlias: UserAlias | null = null;
};

function setCacheStore(
    setAliasStoreState: typeof SetAliasStoreState,
    setWorldStoreState: typeof SetWorldStoreState
) {
    return new Proxy(new CacheStore(), {
        set(target, key, value, receiver) {
            if (!isString(value)) return true;

            // Obtém do target para que a trap "get" não seja acionada.
            const previousAlias = Reflect.get(target, 'userAlias') as UserAlias | null;
            // Obtém do receiver (proxy) para que a trap "get" seja acionada.
            const alias = Reflect.get(receiver, 'userAlias') as UserAlias | null;

            if (isUserAlias(alias) && alias !== previousAlias) {
                setAliasStoreState(alias);
                Reflect.set(target, 'userAlias', alias);
            };

            if (key === 'world' && isWorld(value)) {
                const previousWorld = Reflect.get(target, 'world') as World | null;
                if (value !== previousWorld) setWorldStoreState(value);
            };

            return Reflect.set(target, key, value);
        },
        get(target, key) {
            if (key === 'userAlias') {
                if (!isString(target.player) || !isString(target.world)) return null;
                return generateUserAlias(target.world, target.player);
            };

            return Reflect.get(target, key);
        }
    });
};

export type { CacheStore };
export { setCacheStore };