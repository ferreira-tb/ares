<script setup lang="ts">
import { useVModel } from '@vueuse/core';
import { NButton, NButtonGroup, NPageHeader, NGrid, NGridItem, NStatistic } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

const props = defineProps<{
    average: number;
    period: 'day' | 'week' | 'month';
    wood: number;
    stone: number;
    iron: number;
    attackAmount: number;
    destroyedWalls: number;
}>();

const emit = defineEmits<{
    (e: 'update:period', period: 'day' | 'week' | 'month'): void;
}>();

const locale = await ipcInvoke('app:locale');
const timePeriod = useVModel(props, 'period', emit);
</script>

<template>
    <div>
        <NPageHeader title="Histórico">
            <NGrid :cols="6">
                <NGridItem>
                    <NStatistic label="Madeira" :value="wood.toLocaleString(locale)" />
                </NGridItem>
                <NGridItem>
                    <NStatistic label="Argila" :value="stone.toLocaleString(locale)" />
                </NGridItem>
                <NGridItem>
                    <NStatistic label="Ferro" :value="iron.toLocaleString(locale)" />
                </NGridItem>
                <NGridItem>
                    <NStatistic label="Ataques" :value="attackAmount.toLocaleString(locale)" />
                </NGridItem>
                <NGridItem>
                    <NStatistic label="Muralhas destruídas" :value="destroyedWalls.toLocaleString(locale)" />
                </NGridItem>
                <NGridItem>
                    <NStatistic label="Saque por aldeia" :value="average.toLocaleString(locale)" />
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
    </div>
</template>

<style scoped lang="scss">
.button-area {
    margin-right: 1rem;
}
</style>