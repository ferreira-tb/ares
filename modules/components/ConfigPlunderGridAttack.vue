<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect } from 'naive-ui';
import {
    formatFields,
    parseFields,
    formatHours,
    parseHours,
    formatMilliseconds,
    parseMilliseconds
} from '$modules/utils/input-parser';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(e: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const maxDistance = ref<number>(props.config.maxDistance);
const ignoreOlderThan = ref<number>(props.config.ignoreOlderThan);
const attackDelay = ref<number>(props.config.attackDelay);
const resourceRatio = ref<number>(props.config.resourceRatio);
const blindAttackPattern = ref<BlindAttackPattern>(props.config.blindAttackPattern);

watch(maxDistance, (v) => emit('update:config', 'maxDistance', v));
watch(ignoreOlderThan, (v) => emit('update:config', 'ignoreOlderThan', v));
watch(attackDelay, (v) => emit('update:config', 'attackDelay', v));
watch(resourceRatio, (v) => emit('update:config', 'resourceRatio', v));
watch(blindAttackPattern, (v) => emit('update:config', 'blindAttackPattern', v));

const blindAttackOptions = [
    { label: 'Menor capacidade', value: 'smaller' },
    { label: 'Maior capacidade', value: 'bigger' }
] satisfies NSelectPatternOption<BlindAttackPattern>;
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Ataque</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Distância máxima</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="maxDistance"
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
                    v-model:value="ignoreOlderThan"
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
                <div class="config-label">Delay entre ataques</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="attackDelay"
                    class="config-input"
                    :min="100"
                    :max="60000"
                    :step="10"
                    :validator="(v) => Number.isInteger(v) && v >= 100 && v <= 60000"
                    :format="formatMilliseconds"
                    :parse="parseMilliseconds"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Razão de saque</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="resourceRatio"
                    class="config-input"
                    :min="0.2"
                    :max="1"
                    :step="0.05"
                    :validator="(v) => Number.isFinite(v) && v >= 0.2 && v <= 1"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Padrão do ataque às cegas</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect v-model:value="blindAttackPattern" :options="blindAttackOptions" />
                </div>
            </NGridItem>
        </NGrid>
    </div>
</template>