<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber } from 'naive-ui';
import {
    formatMinutes,
    parseMinutes,
    formatMilliseconds,
    parseMilliseconds,
    formatPercentage,
    parsePercentage
} from '$modules/utils/input-parser';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(e: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const minutesUntilReload = ref<number>(props.config.minutesUntilReload);
const plunderedResourcesRatio = ref<number>(props.config.plunderedResourcesRatio);
const pageDelay = ref<number>(props.config.pageDelay);

watch(minutesUntilReload, (v) => emit('update:config', 'minutesUntilReload', v));
watch(plunderedResourcesRatio, (v) => emit('update:config', 'plunderedResourcesRatio', v));
watch(pageDelay, (v) => emit('update:config', 'pageDelay', v));
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Outros</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Atualização automática</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="minutesUntilReload"
                    class="config-input"
                    :min="1"
                    :max="60"
                    :step="1"
                    :validator="(v) => Number.isInteger(v) && v >= 1 && v <= 60"
                    :format="formatMinutes"
                    :parse="parseMinutes"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Estimativa de saque</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="plunderedResourcesRatio"
                    class="config-input"
                    :min="0.2"
                    :max="1"
                    :step="0.05"
                    :validator="(v) => Number.isFinite(v) && v >= 0.2 && v <= 1"
                    :format="formatPercentage"
                    :parse="parsePercentage"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Delay entre troca de páginas</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="pageDelay"
                    class="config-input"
                    :min="100"
                    :max="60000"
                    :step="100"
                    :validator="(v) => Number.isInteger(v) && v >= 100 && v <= 60000"
                    :format="formatMilliseconds"
                    :parse="parseMilliseconds"
                />
            </NGridItem>
        </NGrid>
    </div>
</template>