<script setup lang="ts">
import { h, toRef } from 'vue';
import { useVModel } from '@vueuse/core';
import { NDataTable, type DataTableColumns } from 'naive-ui';
import { usePlunderHistoryVillageData } from '$modules/composables/plunder-history';

const props = defineProps<{
    headerProps: PlunderHistoryDataTableHeaderProps;
    maxHeight: number;
    history: PlunderHistoryType;
    period: PlunderHistoryTimePeriod;
}>();

const emit = defineEmits<{
    (e: 'update:header', header: PlunderHistoryDataTableHeaderProps): void;
}>();

const header = useVModel(props, 'headerProps', emit);
const villagesHistory = toRef(props, 'history');
const timePeriod = toRef(props, 'period');
const { villageData, onHeaderInfoUpdated } = usePlunderHistoryVillageData(villagesHistory, timePeriod);

onHeaderInfoUpdated((newValue) => (header.value = newValue));

const columns: DataTableColumns<PlunderHistoryVillageData> = [
    {
        title: 'Coordenadas',
        key: 'coords'
    },
    { 
        title: 'Nome',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name, 'pt-br')
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
        render: (rowData) => h('span', rowData.total.toLocaleString('pt-br'))
    },
    { 
        title: 'Ataques',
        key: 'attackAmount',
        sorter: (a, b) => a.attackAmount - b.attackAmount,
        render: (rowData) => h('span', rowData.attackAmount.toLocaleString('pt-br'))
    },
    { 
        title: 'Muralhas destruídas',
        key: 'destroyedWalls',
        sorter: (a, b) => a.destroyedWalls - b.destroyedWalls,
        render: (rowData) => h('span', rowData.destroyedWalls.toLocaleString('pt-br'))
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