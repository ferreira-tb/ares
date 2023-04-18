<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NSelect } from 'naive-ui';
import { isInteger, isFiniteNumber } from '$global/guards';
import { isDistance } from '$global/guards';
import InputNumber from '$renderer/components/InputNumber.vue';
import LabelPopover from '$renderer/components/LabelPopover.vue';
import type { PlunderConfigType, BlindAttackPattern } from '$types/plunder';
import type { NSelectPatternOption } from '$types/utils';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(event: 'update:config', name: T, value: PlunderConfigType[T]): void;
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
                <LabelPopover>
                    <template #trigger>Distância máxima</template>
                    <span>O Ares não atacará aldeias cuja distância (em campos) é maior do que a indicada.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber v-model:value="maxDistance" :min="1" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Evitar relatórios mais antigos que</template>
                    <span>
                        Se o último ataque ocorreu a uma quantidade de horas superior a indicada, o Ares não atacará a
                        aldeia.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="ignoreOlderThan"
                    :min="1"
                    :max="9999"
                    :step="1"
                    :validator="(v) => isInteger(v) && v >= 1"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre ataques</template>
                    <span>
                        O jogo possui um limite de cinco ações por segundo, então o Ares dá uma atrasadinha em cada ataque.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="attackDelay"
                    :min="100"
                    :max="60000"
                    :step="10"
                    :validator="(v) => isInteger(v) && v >= 100 && v <= 60000"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Razão de saque</template>
                    <span>
                        Corresponde à razão entre a quantidade de recursos na aldeia e a capacidade de carga do modelo
                        atacante.
                        Quanto menor for a razão, maior a chance de tropas serem enviadas desnecessariamente.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="resourceRatio"
                    :min="0.2"
                    :max="1"
                    :step="0.05"
                    :validator="(v) => isFiniteNumber(v) && v >= 0.2 && v <= 1"
                />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Padrão do ataque às cegas</template>
                    <span>
                        Determina como o Ares escolherá o modelo para atacar quando não houver informações de exploradores.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect v-model:value="blindAttackPattern" :options="blindAttackOptions" />
                </div>
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped>

</style>