import { ref } from 'mechanus';
import { integerOrNullRef } from '$electron/utils/mechanus';

export function defineGroupsStore(mechanus: Mechanus) {
    return mechanus.define('groups', {
        all: ref<Set<VillageGroup>>(new Set()),
        groupId: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusGroupsStoreType);
};