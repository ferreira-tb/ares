<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { NButton, NButtonGroup, NPageHeader, NGrid, NGridItem, NStatistic } from 'naive-ui';

const props = defineProps<{
    average: number;
    period: PlunderHistoryTimePeriod;
    wood: number;
    stone: number;
    iron: number;
    attackAmount: number;
    destroyedWalls: number;
}>();

const emit = defineEmits<{
    (e: 'update:period', period: PlunderHistoryTimePeriod): void;
}>();

const timePeriod = useVModel(props, 'period', emit);
</script>

<template>
    <NPageHeader title="Histórico">
        <NGrid :cols="6">
            <NGridItem>
                <NStatistic label="Madeira" :value="wood.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Argila" :value="stone.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Ferro" :value="iron.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Ataques" :value="attackAmount.toLocaleString('pt-br')" />
            </NGridItem>
            <NGridItem>
                <NStatistic label="Muralhas destruídas" :value="destroyedWalls.toLocaleString('pt-br')" />
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

<style scoped lang="scss">
.button-area {
    margin-right: 1rem;
}
</style>