import { ref } from 'mechanus';

export * from '$electron/stores/plunder/config';
export * from '$electron/stores/plunder/history';

export function definePlunderStore(mechanus: Mechanus) {
    return mechanus.define('plunder', {
        hideAttacked: ref<boolean>(true),
        page: ref<number>(0),
        pageSize: ref<number | null>(null),
        plunderExhausted: ref<boolean>(false)
    } satisfies MechanusPlunderStoreType);
};

export function definePlunderCacheStore(mechanus: Mechanus) {
    return mechanus.define('plunderCache', {
        pages: ref<PlunderPageListType | null>(null),
        plunderGroup: ref<PlunderGroupType | null>(null),
        demolitionTroops: ref<DemolitionTemplateType | null>(null)
    } satisfies MechanusPlunderCacheStoreType);
};