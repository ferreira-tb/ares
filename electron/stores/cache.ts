import { isString, isKeyOf } from '@tb-dev/ts-guard';
import { generateUserAlias } from '$electron/utils/helpers.js';
import { isUserAlias, isWorld } from '$electron/utils/guards.js';
import type { CacheProxyType, UserAlias } from '$types/electron.js';
import type { World } from '$types/game.js';

class CacheProxy implements CacheProxyType {
    world: World | null = null;
    player: string | null = null;
    userAlias: UserAlias | null = null;
};

export function setCacheProxy(
    setAliasProxyState: (alias: UserAlias) => Promise<void>,
    setWorldProxyState: (world: World) => Promise<void>
) {
    return new Proxy(new CacheProxy(), {
        set(target: CacheProxy, key: keyof CacheProxy, value: CacheProxy[keyof CacheProxy], receiver: CacheProxy) {
            if (!isKeyOf(key, target)) return false;
            if (!isString(value)) return true;

            // Obtém do target para que a trap "get" não seja acionada.
            const previousAlias = Reflect.get(target, 'userAlias');
            // Agora obtém do receiver (proxy) para que a trap "get" seja acionada.
            const alias = Reflect.get(receiver, 'userAlias');

            if (isUserAlias(alias) && alias !== previousAlias) {
                Reflect.set(target, 'userAlias', alias);
                setAliasProxyState(alias);
            };

            if (key === 'world') {
                if (!isWorld(value)) return false;
                const previousWorld = Reflect.get(target, 'world');
                if (value !== previousWorld) setWorldProxyState(value);
            };

            return Reflect.set(target, key, value);
        },
        get(target: CacheProxy, key: keyof CacheProxy) {
            if (key === 'userAlias') {
                if (!isString(target.player) || !isString(target.world)) return null;
                return generateUserAlias(target.world, target.player);
            };

            return Reflect.get(target, key);
        }
    });
};

export type { CacheProxy };