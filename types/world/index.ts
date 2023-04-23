import type { World } from '$types/game';
import type { WorldVillagesType } from '$types/world/villages';

export * from '$types/world/config';
export * from '$types/world/units';
export * from '$types/world/villages';

export type WorldDataType = {
    villages: WorldVillagesType[];
};

export type WorldDataFetchHistoryType = {
    readonly world: World;
    readonly village: number | null;
    readonly player: number | null;
    readonly ally: number | null;
};