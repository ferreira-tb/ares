import { ref } from 'mechanus';

export function defineGroupsStore(mechanus: Mechanus) {
    return mechanus.define('groups', {
        all: ref<Set<VillageGroup>>(new Set()),
        groupId: ref<number | null>(null)
    } satisfies MechanusGroupsStoreType);
};