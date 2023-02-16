import { isString } from '@tb-dev/ts-guard';
import type { BrowserStoreType } from '$types/electron.js';

class BrowserStore implements BrowserStoreType {
    majorVersion: string | null = null;
    currentWorld: string | null = null;
    currentPlayer: string | null = null;
    currentPlayerId: number | null = null;
    currentPlayerPoints: number | null = null;
    villageAmount: number | null = null;
    groupId: number | null = null;

    // Features
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

export const browserStore = new Proxy(new BrowserStore(), {
    set(target, prop, value) {
        if (!isString(prop)) return false;
        return Reflect.set(target, prop, value);
    },
    get(target, prop) {
        switch (prop) {
            case 'currentCoords':
                return [target.currentX, target.currentY];
            case 'currentVillageTotalResources':
                const wood = target.currentVillageWood;
                const stone = target.currentVillageStone;
                const iron = target.currentVillageIron;
                if (wood === null || stone === null || iron === null) return null;
                return wood + stone + iron;
            default:
                return Reflect.get(target, prop);
        };
    }
});