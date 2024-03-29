import { ref } from 'mechanus';

export * from '$electron/stores/game/plunder/config';
export * from '$electron/stores/game/plunder/history';

export function definePlunderStore(mechanus: Mechanus) {
    return mechanus.define('plunder', () => {
        const hideAttacked = ref<boolean>(true);
        const page = ref<number>(0);
        const pageSize = ref<number | null>(null);
        const plunderExhausted = ref<boolean>(false);

        return {
            hideAttacked,
            page,
            pageSize,
            plunderExhausted
        } satisfies MechanusPlunderStoreType;
    });
};

export function definePlunderCacheStore(mechanus: Mechanus) {
    return mechanus.define('plunderCache', () => {
        const pages = ref<PlunderPageListType | null>(null);
        const plunderGroup = ref<PlunderGroupType | null>(null);
        const demolitionTroops = ref<DemolitionTemplateType | null>(null);

        return {
            pages,
            plunderGroup,
            demolitionTroops
        } satisfies MechanusPlunderCacheStoreType;
    });
};