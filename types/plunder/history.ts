export type PlunderAttackLog = {
    wood: number;
    stone: number;
    iron: number;
    attackAmount: number;
    destroyedWalls: number;
};

export interface PlunderHistoryVillageType extends PlunderAttackLog {
    readonly addedAt: number;
};

export interface PlunderHistoryType extends PlunderAttackLog {
    /** Histórico individual de cada aldeia nos últimos 30 dias. */
    readonly villages: {
        [id: string]: PlunderHistoryVillageType[];
    };
};