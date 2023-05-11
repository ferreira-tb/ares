<script setup lang="ts">
import { computed, ref, type ComponentPublicInstance } from 'vue';
import { useElementSize, useWindowSize } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { ipcInvoke } from '$renderer/ipc';
import PlunderHistoryHeader from '$modules/components/PlunderHistoryHeader.vue';
import PlunderHistoryDataTable from '$modules/components/PlunderHistoryDataTable.vue';

const previousHistory = await ipcInvoke('plunder:get-history');
const history = ref<PlunderHistoryType>(previousHistory);

const average = ref<number>(0);
const period = ref<'day' | 'month' | 'week'>('month');

const header = ref<ComponentPublicInstance | null>(null);
const { height } = useWindowSize();
const { height: headerHeight } = useElementSize(header);
const tableMaxHeight = computed(() => (height.value - headerHeight.value) - 100);

useIpcRendererOn('plunder:history-did-update', (_e, updatedHistory: PlunderHistoryType) => {
    history.value = updatedHistory;
});
</script>

<template>
    <main>
        <PlunderHistoryHeader ref="header" v-model:period="period" :average="average" :history="history" />
        <PlunderHistoryDataTable
            v-model:average="average"
            :max-height="tableMaxHeight"
            :history="history"
            :period="period"
        />
    </main>
</template>