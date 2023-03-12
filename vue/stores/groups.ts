import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { PiniaGroupsStoreType } from '$types/stores';

export const useGroupsStore = defineStore('groups', () => {
    const groupId = ref<number | null>(null);

    return {
        groupId
    } satisfies PiniaGroupsStoreType;
});