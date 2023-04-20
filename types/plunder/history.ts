import type { PlunderAttackDetails } from '$types/plunder/attack';

export type PlunderHistoryType = {
    last: PlunderAttackDetails;
    total: PlunderAttackDetails;
};