<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NSelect, NInputNumber } from 'naive-ui';
import { formatFields, parseFields, formatHours, parseHours } from '$modules/utils/input-parser';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(e: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const useCPattern = ref<UseCPattern>(props.config.useCPattern);
const maxDistanceC = ref<number>(props.config.maxDistanceC);
const ignoreOlderThanC = ref<number>(props.config.ignoreOlderThanC);
const useCWhenResourceRatioIsBiggerThan = ref<number>(props.config.useCWhenResourceRatioIsBiggerThan);

watch(useCPattern, (v) => emit('update:config', 'useCPattern', v));
watch(maxDistanceC, (v) => emit('update:config', 'maxDistanceC', v));
watch(ignoreOlderThanC, (v) => emit('update:config', 'ignoreOlderThanC', v));
watch(useCWhenResourceRatioIsBiggerThan, (v) => emit('update:config', 'useCWhenResourceRatioIsBiggerThan', v));

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
                    <NSelect v-model:value="useCPattern" :options="useCOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="maxDistanceC"
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
                    v-model:value="ignoreOlderThanC"
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
                    v-model:value="useCWhenResourceRatioIsBiggerThan"
                    class="config-input"
                    :disabled="useCPattern !== 'excess'"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                />
            </NGridItem>
        </NGrid>
    </div>
</template>