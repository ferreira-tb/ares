<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem } from 'naive-ui';
import { isPositiveInteger, isPositiveNumber } from '@tb-dev/ts-guard';
import InputNumber from '$renderer/components/InputNumber.vue';
import LabelPopover from '$renderer/components/LabelPopover.vue';
import type { PlunderConfigType } from '$types/plunder';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(event: 'update:config', name: T, value: PlunderConfigType[T]): void;
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
                <LabelPopover>
                    <template #trigger>Atualização automática</template>
                    <span>Tempo, em minutos, até que a página seja atualizada automaticamente durante o saque.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="minutesUntilReload"
                    :min="1"
                    :max="60"
                    :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1 && v <= 60"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Estimativa de saque</template>
                    <span>
                        Por padrão, o Ares sempre considera que o modelo atacante saqueará 100% de sua capacidade de carga.
                        Você pode alterar isso para que ele considere uma porcentagem menor.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="plunderedResourcesRatio"
                    :min="0.2"
                    :max="1"
                    :step="0.05"
                    :validator="(v) => isPositiveNumber(v) && v >= 0.2 && v <= 1"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre troca de páginas</template>
                    <span>
                        Quando o Ares não encontra aldeias para atacar, ele tenta trocar de página.
                        Esse delay determina quantos milissegundos o Ares deve esperar antes dessa tentativa.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="pageDelay"
                    :min="100"
                    :max="60000"
                    :step="100"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 60000"
                />
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped>

</style>