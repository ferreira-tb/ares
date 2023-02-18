import { isString } from '@tb-dev/ts-guard';
import type { savePlayerAsUser as SavePlayerAsUser } from '$interface/interface.js';
import type { CacheStore } from '$electron/stores/cache.js';
import type { BrowserStoreType } from '$types/electron.js';

class BrowserStore implements BrowserStoreType {
    majorVersion: string | null = null;
    currentWorld: string | null = null;
    currentPlayer: string | null = null;
    currentPlayerId: number | null = null;
    currentPlayerPoints: number | null = null;
    villageAmount: number | null = null;
    groupId: number | null = null;

    premium: boolean | null = null;
    accountManager: boolean | null = null;
    farmAssistant: boolean | null = null;

    currentScreen: string | null = null;
    screenMode: string | null = null;
    pregame: boolean | null = null;

    currentX: number | null = null;
    currentY: number | null = null;
    currentCoords: [number | null, number | null] = [null, null];
    currentVillageId: number | null = null;
    currentVillageName: string | null = null;
    currentVillagePopulation: number | null = null;
    currentVillageMaxPopulation: number | null = null;
    currentVillagePoints: number | null = null;
    currentVillageWood: number | null = null;
    currentVillageStone: number | null = null;
    currentVillageIron: number | null = null;
    currentVillageTotalResources: number | null = null;
    currentVillageMaxStorage: number | null = null;
};

function setBrowserStore(cacheStore: CacheStore, savePlayerAsUser: typeof SavePlayerAsUser) {
    return new Proxy(new BrowserStore(), {
        get(target, key) {
            switch (key) {
                case 'currentCoords':
                    return [target.currentX, target.currentY];
                case 'currentVillageTotalResources':
                    const wood = target.currentVillageWood;
                    const stone = target.currentVillageStone;
                    const iron = target.currentVillageIron;
                    if (wood === null || stone === null || iron === null) return null;
                    return wood + stone + iron;
                default:
                    return Reflect.get(target, key);
            };
        },
        set(target, key, value) {
            if (key === 'currentWorld' && isString(value)) {
                cacheStore.world = value;
            } else if (key === 'currentPlayer' && isString(value)) {
                const previous = Reflect.get(target, key);
                if (previous !== value) savePlayerAsUser(value);
                cacheStore.player = value;
            };
    
            return Reflect.set(target, key, value);
        }
    });
};

export type { BrowserStore };
export { setBrowserStore };