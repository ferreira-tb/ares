type WorldDataType = {
    villages: WorldVillagesType[];
};

type WorldDataFetchHistoryType = {
    readonly world: World;
    readonly village: number | null;
    readonly player: number | null;
    readonly ally: number | null;
};