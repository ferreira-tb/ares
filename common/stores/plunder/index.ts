import { ref } from 'mechanus';

export * from '$common/stores/plunder/config';
export * from '$common/stores/plunder/history';

export function definePlunderCacheStore(mechanus: Mechanus) {
    return mechanus.define('plunder-cache', () => {
        const pages = ref<PlunderPageListType | null>(null);
        const plunderGroup = ref<PlunderGroupType | null>(null);
        const demolitionTemplate = ref<PlunderDemolitionTemplateType | null>(null);

        return {
            pages,
            plunderGroup,
            demolitionTemplate
        } satisfies MechanusPlunderCacheStoreType;
    });
}