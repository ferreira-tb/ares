<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import PlunderHistoryHeader from '$windows/components/PlunderHistoryHeader.vue';
import PlunderHistoryDataTable from '$windows/components/PlunderHistoryDataTable.vue';

const previousHistory = await ipcInvoke('plunder:get-history');
const history = ref<PlunderHistoryType>(previousHistory);

const period = ref<PlunderHistoryTimePeriod>('month');
const headerProps = ref<PlunderHistoryDataTableHeaderProps>({
    average: 0,
    wood: 0,
    stone: 0,
    iron: 0,
    attackAmount: 0,
    destroyedWalls: 0
});

const header = ref<ComponentPublicInstance | null>(null);
const { height } = useWindowSize();
const { height: headerHeight } = useElementSize(header);
const tableMaxHeight = computed(() => (height.value - headerHeight.value) - 100);

useIpcOn('plunder:history-did-update', (_e, updatedHistory: PlunderHistoryType) => {
    history.value = updatedHistory;
});
</script>

<template>
    <main>
        <PlunderHistoryHeader ref="header" v-model:period="period" v-bind="headerProps" />
        <PlunderHistoryDataTable
            v-model:header-props="headerProps"
            :max-height="tableMaxHeight"
            :history="history"
            :period="period"
        />
    </main>
</template>