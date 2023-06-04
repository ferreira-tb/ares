import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useGroupsStore = defineStore('groups', () => {
    const all = ref<Set<VillageGroup>>(new Set());
    const groupId = ref<number | null>(null);

    return {
        all,
        groupId
    } satisfies PiniaGroupsStoreType;
});