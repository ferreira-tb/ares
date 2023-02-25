import { isKeyOf } from '@tb-dev/ts-guard';
import type { CurrentVillageStore } from '$types/stores.js';
import type { RemoveMethods } from '$types/utils.js';

class CurrentVillageProxy implements RemoveMethods<CurrentVillageStore> {
    x: number | null = null;
    y: number | null = null;
    id: number | null = null;
    name: string | null = null;
    population: number | null = null;
    maxPopulation: number | null = null;
    points: number | null = null;
    wood: number | null = null;
    stone: number | null = null;
    iron: number | null = null;
    maxStorage: number | null = null;

    coords: [number | null, number | null] = [null, null];
    totalResources: number | null = null;
};

export function setCurrentVillageProxy() {
    return new Proxy(new CurrentVillageProxy(), {
        get(target, key) {
            switch (key) {
                case 'coords':
                    return [target.x, target.y];
                case 'totalResources':
                    const wood = target.wood;
                    const stone = target.stone;
                    const iron = target.iron;
                    if (wood === null || stone === null || iron === null) return null;
                    return wood + stone + iron;
                default:
                    return Reflect.get(target, key);
            };
        },
        set(target, key, value) {
            if (!isKeyOf(key, target)) return false;
            return Reflect.set(target, key, value);
        }
    });
};