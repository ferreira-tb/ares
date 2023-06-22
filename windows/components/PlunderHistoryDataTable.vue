<script setup lang="ts">
import { h } from 'vue';
import { NDataTable, NEllipsis, type DataTableColumns } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

defineProps<{
    villageData: PlunderHistoryVillageData[];
    headerProps: PlunderHistoryDataTableHeaderProps;
    period: 'day' | 'week' | 'month';
    maxHeight: number;
}>();

const locale = await ipcInvoke('app:locale');

const columns: DataTableColumns<PlunderHistoryVillageData> = [
    {
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Coordenadas' }),
        key: 'coords',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.coords })
    },
    { 
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Nome' }),
        key: 'name',
        resizable: true,
        render: (row) => h(NEllipsis, { tooltip: false, textContent: row.name }),
        sorter: (a, b) => a.name.localeCompare(b.name, locale)
    },
    { 
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Desempenho' }),
        key: 'score',
        resizable: true,
        sorter: (a, b) => a.score - b.score,
        render: (row) => h(NEllipsis, {
            tooltip: false,
            textContent: `${Math.ceil(row.score).toString(10)}%`
        })
    },
    { 
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Recursos saqueados' }),
        key: 'total',
        defaultSortOrder: 'descend',
        resizable: true,
        sorter: (a, b) => a.total - b.total,
        render: (row) => h(NEllipsis, {
            tooltip: false,
            textContent: row.total.toLocaleString(locale)
        })
    },
    { 
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Ataques' }),
        key: 'attackAmount',
        resizable: true,
        sorter: (a, b) => a.attackAmount - b.attackAmount,
        render: (row) => h(NEllipsis, {
            tooltip: false,
            textContent: row.attackAmount.toLocaleString(locale)
        })
    },
    { 
        title: () => h(NEllipsis, { tooltip: false, textContent: 'Muralhas destruídas' }),
        key: 'destroyedWalls',
        resizable: true,
        sorter: (a, b) => a.destroyedWalls - b.destroyedWalls,
        render: (row) => h(NEllipsis, {
            tooltip: false,
            textContent: row.destroyedWalls.toLocaleString(locale)
        })
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