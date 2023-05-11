type PlunderAttackLog = {
    wood: number;
    stone: number;
    iron: number;
    attackAmount: number;
    destroyedWalls: number;
};

interface PlunderHistoryVillageType extends PlunderAttackLog {
    readonly addedAt: number;
};

interface PlunderHistoryType extends PlunderAttackLog {
    /** Histórico individual de cada aldeia nos últimos 30 dias. */
    readonly villages: {
        [id: string]: PlunderHistoryVillageType[];
    };
};