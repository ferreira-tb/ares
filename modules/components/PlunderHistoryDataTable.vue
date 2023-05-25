<script setup lang="ts">
import { h, toRef } from 'vue';
import { useVModel } from '@vueuse/core';
import { NDataTable, type DataTableColumns } from 'naive-ui';
import { usePlunderHistoryVillageData } from '$modules/composables/plunder-history';

const props = defineProps<{
    average: number;
    maxHeight: number;
    history: PlunderHistoryType;
    period: PlunderHistoryTimePeriod;
}>();

const emit = defineEmits<{
    (e: 'update:average', average: number): void;
}>();

const weightedAverage = useVModel(props, 'average', emit);
const timePeriod = toRef(props, 'period');
const villagesHistory = toRef(props, 'history');
const { villageData, onAverageChange } = usePlunderHistoryVillageData(villagesHistory, timePeriod);

onAverageChange((average) => (weightedAverage.value = average));

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