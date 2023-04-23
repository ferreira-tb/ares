import type { PlunderHistoryVillageType } from '$types/plunder';

export class PlunderHistoryVillage implements PlunderHistoryVillageType {
    readonly addedAt: number = new Date().setUTCHours(0, 0, 0, 0);
    wood: number = 0;
    stone: number = 0;
    iron: number = 0;
    destroyedWalls: number = 0;
    attackAmount: number = 0;
};