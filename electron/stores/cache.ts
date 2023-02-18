import { MainProcessError } from '$electron/error.js';
import type { CacheStoreType, UserAlias } from '$types/electron.js';
import type { getUserAlias as GetUserAlias, setStoreState as SetStoreState } from '$electron/stores/index.js';

class CacheStore implements CacheStoreType {
    lastWorld: string | null = null;
    lastPlayer: string | null = null;
    lastUserAlias: UserAlias | null = null;
};

function setCacheStore(getUserAlias: typeof GetUserAlias, setStoreState: typeof SetStoreState) {
    return new Proxy(new CacheStore(), {
        set(target, key, value) {
            if (key in target)  {
                if (value === null) return true;
    
                // Não atualiza o valor se for igual ao anterior.
                const previous = Reflect.get(target, key) as CacheStore[keyof CacheStore];
                if (previous === value) return true;
    
                if (key === 'lastWorld' || key === 'lastPlayer') {
                    getUserAlias().catch(MainProcessError.capture);
                } else if (key === 'lastUserAlias') {
                    setStoreState();
                };
    
                return Reflect.set(target, key, value);
            };
    
            return false;
        }
    });
};

export type { CacheStore };
export { setCacheStore };