<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useVModel, watchImmediate } from '@vueuse/core';
import { NDataTable, type DataTableColumns } from 'naive-ui';
import { Kronos } from '$global/constants';
import { ipcInvoke } from '$renderer/ipc';
import { getContinentFromCoords } from '$global/helpers';

interface PlunderHistoryVillageData {
    readonly coords: string;
    readonly name: string;
    readonly total: number;
    readonly attackAmount: number;
    readonly destroyedWalls: number;
    score: string;
    rawScore: number;
};

const props = defineProps<{
    average: number;
    maxHeight: number;
    history: PlunderHistoryType;
    period: 'day' | 'month' | 'week';
}>();

const emit = defineEmits<{
    (e: 'update:average', average: number): void;
}>();

const weightedAverage = useVModel(props, 'average', emit);

const idList = computed<number[]>(() => {
    return Object.keys(props.history.villages).asIntegerListStrict();
});

const villageMap = reactive(new Map<number, WorldVillagesType>());
watchImmediate(idList, async (updatedList) => {
    const list = updatedList.filter((id) => !villageMap.has(id));
    if (list.length === 0) return;

    const worldVillages = await ipcInvoke('world-data:get-village', list);
    for (const village of worldVillages) {
        villageMap.set(village.id, village);
    };
});

const data = ref<PlunderHistoryVillageData[]>([]);
watchImmediate([() => props.period, () => props.history.villages, villageMap], () => {
    const allData: PlunderHistoryVillageData[] = [];
    for (const [rawId, logs] of Object.entries(props.history.villages)) {
        const id = rawId.toIntegerStrict();
        if (!villageMap.has(id) || logs.length === 0) continue;

        const info = villageMap.getStrict(id);
        const parsedLogs = parseLogs(logs);
        if (parsedLogs.attackAmount === 0) continue;

        const villageData = {
            coords: `${info.x.toString(10)}|${info.y.toString(10)} ${getContinentFromCoords(info.x, info.y, 'K')}`,
            name: decodeURIComponent(info.name.replace(/\+/g, ' ')),
            score: '0%',
            rawScore: 0,
            ...parsedLogs
        };

        allData.push(villageData);
    };

    if (allData.length === 0) return;
    const weightedSum = allData.reduce((acc, cur) => acc + (cur.total * cur.attackAmount), 0);
    const totalAttacks = allData.reduce((acc, cur) => acc + cur.attackAmount, 0);
    if (totalAttacks === 0) return;

    const average = Math.ceil(weightedSum / totalAttacks);
    if (average === 0) return;

    for (const village of allData) {
        village.rawScore = (village.total / average) * 100;
        village.score = `${Math.ceil(village.rawScore).toString(10)}%`;
    };

    data.value = allData;
    weightedAverage.value = average;
});

const columns: DataTableColumns<PlunderHistoryVillageData> = [
    { title: 'Coordenadas', key: 'coords' },
    { title: 'Nome', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name, 'pt-br') },
    { title: 'Desempenho', key: 'score', sorter: (a, b) => a.rawScore - b.rawScore },
    { title: 'Recursos saqueados', key: 'total', defaultSortOrder: 'descend', sorter: (a, b) => a.total - b.total },
    { title: 'Ataques', key: 'attackAmount', sorter: (a, b) => a.attackAmount - b.attackAmount },
    { title: 'Muralhas destruídas', key: 'destroyedWalls', sorter: (a, b) => a.destroyedWalls - b.destroyedWalls }
];

function parseLogs(logs: PlunderHistoryVillageType[]) {
    let total: number = 0;
    let attackAmount: number = 0;
    let destroyedWalls: number = 0;

    for (const log of filterLogs(logs)) {
        total += (log.wood + log.stone + log.iron);
        attackAmount += log.attackAmount;
        destroyedWalls += log.destroyedWalls;
    };

    return {
        total,
        attackAmount,
        destroyedWalls
    } as const;
};

function filterLogs(logs: PlunderHistoryVillageType[]) {
    const now = Date.now();
    const midnight = new Date().setUTCHours(0, 0, 0, 0);

    logs = logs.filter((log) => log.attackAmount > 0);
    if (props.period === 'day') return logs.filter((log) => log.addedAt === midnight);
    if (props.period === 'week') return logs.filter((log) => log.addedAt >= (now - Kronos.Week));
    return logs.filter((log) => log.addedAt >= (now - Kronos.Month));
};
</script>

<template>
    <div class="history-table">
        <NDataTable virtual-scroll :max-height="maxHeight" :columns="columns" :data="data">
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