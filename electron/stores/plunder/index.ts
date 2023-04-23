import { ref } from 'mechanus';
import { integerRef, booleanRef, integerOrNullRef } from '$electron/utils/mechanus';
import type { Mechanus } from 'mechanus';
import type { PlunderPageListType, DemolitionTemplateType, PlunderGroupType } from '$types/plunder';
import type { MechanusPlunderStoreType, MechanusPlunderCacheStoreType } from '$types/stores';

export * from '$stores/plunder/config';
export * from '$stores/plunder/history';

export function definePlunderStore(mechanus: Mechanus) {
    return mechanus.define('plunder', {
        hideAttacked: ref<boolean>(true, booleanRef),
        page: ref<number>(0, integerRef),
        pageSize: ref<number | null>(null, integerOrNullRef),
        plunderExhausted: ref<boolean>(false, booleanRef)
    } satisfies MechanusPlunderStoreType);
};

export function definePlunderCacheStore(mechanus: Mechanus) {
    return mechanus.define('plunderCache', {
        pages: ref<PlunderPageListType | null>(null),
        plunderGroup: ref<PlunderGroupType | null>(null),
        demolitionTroops: ref<DemolitionTemplateType | null>(null)
    } satisfies MechanusPlunderCacheStoreType);
};