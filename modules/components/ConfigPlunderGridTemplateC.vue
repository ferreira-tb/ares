<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NSelect } from 'naive-ui';
import { isDistance } from '$global/guards';
import InputNumber from '$renderer/components/InputNumber.vue';
import LabelPopover from '$renderer/components/LabelPopover.vue';
import type { PlunderConfigType, UseCPattern } from '$types/plunder';
import type { NSelectPatternOption } from '$types/utils';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(event: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const useCPattern = ref<UseCPattern>(props.config.useCPattern);
const maxDistanceC = ref<number>(props.config.maxDistanceC);

watch(useCPattern, (v) => emit('update:config', 'useCPattern', v));
watch(maxDistanceC, (v) => emit('update:config', 'maxDistanceC', v));

const useCOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Somente C', value: 'only' }
] satisfies NSelectPatternOption<UseCPattern>;
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Modelo C</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <LabelPopover>
                    <template #trigger>Padrão do modelo C</template>
                    <span>
                        Quanto o uso do modelo C está ativado, o Ares tentará enviar ataques usando-o.
                        Se não conseguir, tentará com algum outro modelo.

                        Você pode alterar esse comportamento de maneira a forçá-lo a usar somente o modelo C.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect v-model:value="useCPattern" :options="useCOptions" />
                </div>
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Distância máxima</template>
                    <span>O Ares não atacará aldeias usando o modelo C quando a distância (em campos) for maior do que a indicada.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber v-model:value="maxDistanceC" :min="1" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped>

</style>