<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NSelect, NInputNumber } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import { formatFields, parseFields, formatHours, parseHours } from '$windows/utils/input-parser';

const config = usePlunderConfigStore();

const useCOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Quando em excesso', value: 'excess' },
    { label: 'Somente C', value: 'only' }
] satisfies NSelectPatternOption<UseCPattern>;
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Modelo C</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Padrão do modelo C</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect v-model:value="config.useCPattern" :options="useCOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.maxDistanceC"
                    class="config-input"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                    :format="formatFields"
                    :parse="parseFields"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Evitar mais antigos que</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.ignoreOlderThanC"
                    class="config-input"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && v >= 1"
                    :format="formatHours"
                    :parse="parseHours"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Usar C se a razão for maior que</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.useCWhenResourceRatioIsBiggerThan"
                    class="config-input"
                    :disabled="config.useCPattern !== 'excess'"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                />
            </NGridItem>
        </NGrid>
    </div>
</template>