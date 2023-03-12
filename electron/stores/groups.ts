import { ref, type Mechanus } from 'mechanus';
import { integerOrNullRef } from '$electron/utils/mechanus';
import type { MechanusGroupsStoreType } from '$types/stores';
import type { VillageGroup } from '$types/game';

export function defineGroupsStore(mechanus: Mechanus) {
    return mechanus.define('groups', {
        all: ref<VillageGroup[]>([]),
        groupId: ref<number | null>(null, integerOrNullRef)
    } satisfies MechanusGroupsStoreType);
};