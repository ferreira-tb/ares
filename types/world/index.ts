import type { WorldVillagesType } from '$types/world/villages';

export * from '$types/world/config';
export * from '$types/world/history';
export * from '$types/world/units';
export * from '$types/world/villages';

export type WorldDataType = {
    villages: WorldVillagesType[];
};