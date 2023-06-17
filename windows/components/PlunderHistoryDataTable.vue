<script setup lang="ts">
import { h, toRef } from 'vue';
import { useVModel } from '@vueuse/core';
import { NDataTable, type DataTableColumns } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { usePlunderHistory } from '$windows/composables/plunder-history';

const props = defineProps<{
    headerProps: PlunderHistoryDataTableHeaderProps;
    maxHeight: number;
    history: PlunderHistoryType;
    period: PlunderHistoryTimePeriod;
}>();

const emit = defineEmits<{
    (e: 'update:header', header: PlunderHistoryDataTableHeaderProps): void;
}>();

const locale = await ipcInvoke('app:locale');
const header = useVModel(props, 'headerProps', emit);
const villagesHistory = toRef(props, 'history');
const timePeriod = toRef(props, 'period');
const { villageData, onHeaderInfoUpdated } = usePlunderHistory(villagesHistory, timePeriod);

onHeaderInfoUpdated((newValue) => (header.value = newValue));

const columns: DataTableColumns<PlunderHistoryVillageData> = [
    {
        title: 'Coordenadas',
        key: 'coords'
    },
    { 
        title: 'Nome',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name, locale)
    },
    { 
        title: 'Desempenho',
        key: 'score',
        sorter: (a, b) => a.score - b.score,
        render: (rowData) => h('span', `${Math.ceil(rowData.score).toString(10)}%`)
    },
    { 
        title: 'Recursos saqueados',
        key: 'total',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.total - b.total,
        render: (rowData) => h('span', rowData.total.toLocaleString(locale))
    },
    { 
        title: 'Ataques',
        key: 'attackAmount',
        sorter: (a, b) => a.attackAmount - b.attackAmount,
        render: (rowData) => h('span', rowData.attackAmount.toLocaleString(locale))
    },
    { 
        title: 'Muralhas destruídas',
        key: 'destroyedWalls',
        sorter: (a, b) => a.destroyedWalls - b.destroyedWalls,
        render: (rowData) => h('span', rowData.destroyedWalls.toLocaleString(locale))
    }
];
</script>

<template>
    <div class="history-table">
        <NDataTable
            virtual-scroll
            :columns="columns"
            :data="villageData"
            :max-height="maxHeight"
            :row-key="(rowData: PlunderHistoryVillageData) => rowData.coords"
        >
            <template #empty>
                Nenhum registro encontrado
            </template>
        </NDataTable>
    </div>
</template>

<style scoped lang="scss">
.history-table {
    margin-top: 1rem;
}
</style>