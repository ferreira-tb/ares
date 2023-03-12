import { ref, type Mechanus } from 'mechanus';
import { integerOrNullRef } from '$electron/utils/mechanus';
import type { MechanusGroupsStoreType } from '$types/stores';

export function defineGroupsStore(mechanus: Mechanus) {
    return mechanus.define('groups', {
        groupId: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusGroupsStoreType);
};