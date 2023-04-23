<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { NButton, NButtonGroup, NPageHeader, NGrid, NGridItem, NStatistic } from 'naive-ui';
import type { PlunderHistoryType } from '$types/plunder';

const props = defineProps<{
    average: number;
    period: 'day' | 'month' | 'week';
    history: PlunderHistoryType;
}>();

const emit = defineEmits<{
    (e: 'update:period', period: 'day' | 'month' | 'week'): void;
}>();

const timePeriod = useVModel(props, 'period', emit);
</script>

<template>
    <NPageHeader title="Histórico">
        <NGrid :cols="6">
            <NGridItem>
                <NStatistic label="Madeira" :value="history.wood.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Argila" :value="history.stone.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Ferro" :value="history.iron.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Ataques" :value="history.attackAmount.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Muralhas destruídas" :value="history.destroyedWalls.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Saque por aldeia" :value="average.toLocaleString('pt-br')" />
            </NGridItem>
        </NGrid>

        <template #extra>
            <div class="button-area">
                <NButtonGroup>
                    <NButton type="default" size="small" @click="timePeriod = 'day'">Hoje</NButton>
                    <NButton type="default" size="small" @click="timePeriod = 'week'">7 dias</NButton>
                    <NButton type="default" size="small" @click="timePeriod = 'month'">30 dias</NButton>
                </NButtonGroup>
            </div>
        </template>
    </NPageHeader>
</template>

<style scoped>
.button-area {
    margin-right: 1rem;
}
</style>