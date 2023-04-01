<script setup lang="ts">
import { ref, watch } from 'vue';
import { NDivider, NGrid, NGridItem, NSelect } from 'naive-ui';
import NumberImput from '$global/components/input/NumberInput.vue';
import LabelPopover from '$global/components/popover/LabelPopover.vue';
import type { BlindAttackPattern, UseCPattern } from '$types/plunder';

// Opções dos NSelect.
type PatternOption<T> = ReadonlyArray<{
    label: string;
    value: T;
}>;

const blindAttackOptions = [
    { label: 'Menor capacidade', value: 'smaller' },
    { label: 'Maior capacidade', value: 'bigger' }
] satisfies PatternOption<BlindAttackPattern>;

const useCOptions = [
    { label: 'Normal', value: 'normal' },
    { label: 'Somente C', value: 'only'}
] satisfies PatternOption<UseCPattern>;
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
                <NumberImput v-model:value="maxDistance" :min="1" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
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
                <NumberImput v-model:value="ignoreOlderThan" :min="1" :max="9999" :step="1"
                    :validator="(v) => isPositiveInteger(v) && v >= 1" />
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
                <NumberImput v-model:value="attackDelay" :min="100" :max="60000" :step="10"
                    :validator="(v) => isPositiveInteger(v) && v >= 100 && v <= 60000" />
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
                <NumberImput v-model:value="resourceRatio" :min="0.2" :max="1" :step="0.05"
                    :validator="(v) => isPositiveNumber(v) && v >= 0.2 && v <= 1" />
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
        </NGrid>
    </div>
</template>

<style scoped>

</style>