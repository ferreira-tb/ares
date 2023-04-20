import type { World } from '$types/game';

export type WorldFetchHistoryType = {
    readonly world: World;
    readonly village: number | null;
    readonly player: number | null;
    readonly ally: number | null;
};