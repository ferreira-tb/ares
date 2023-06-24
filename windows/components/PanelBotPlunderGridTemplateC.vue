<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import { formatFields, parseFields, formatHours, parseHours } from '$renderer/utils/format-input';

const config = usePlunderConfigStore();

const useCOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Quando em excesso', value: 'excess' },
    { label: 'Somente C', value: 'only' }
] satisfies NSelectOptions<UseCPattern>;
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Modelo C</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem :span="2">
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.useC" round size="small" />
                    <div class="switch-label">Usar modelo C</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Padrão do modelo C</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect
                        v-model:value="config.useCPattern"
                        :options="useCOptions"
                        :disabled="!config.useC"
                    />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.maxDistanceC"
                    class="config-input"
                    :disabled="!config.useC"
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
                    :disabled="!config.useC"
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
                    :disabled="!config.useC || config.useCPattern !== 'excess'"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                />
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped lang="scss">
.labeled-switch-wrapper {
    margin-bottom: 0.5rem;
}
</style>