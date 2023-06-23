<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import {
    formatFields,
    parseFields,
    formatHours,
    parseHours,
    formatMilliseconds,
    parseMilliseconds
} from '$renderer/utils/format-input';

const config = usePlunderConfigStore();

const blindAttackOptions = [
    { label: 'Menor capacidade', value: 'smaller' },
    { label: 'Maior capacidade', value: 'bigger' }
] satisfies NSelectOptions<BlindAttackPattern>;
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Ataque</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.ignoreDelay" round size="small" />
                    <div class="switch-label">Ignorar delay</div>
                </div>
            </NGridItem>
            <NGridItem>
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.blindAttack" round size="small" />
                    <div class="switch-label">Ataque às cegas</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Distância máxima</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.maxDistance"
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
                    v-model:value="config.ignoreOlderThan"
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
                    v-model:value="config.attackDelay"
                    class="config-input"
                    :disabled="config.ignoreDelay"
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
                    v-model:value="config.resourceRatio"
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
                    <NSelect
                        v-model:value="config.blindAttackPattern"
                        :options="blindAttackOptions"
                        :disabled="!config.blindAttack"
                    />
                </div>
            </NGridItem>
        </NGrid>
    </div>
</template>

<style scoped lang="scss">
.labeled-switch-wrapper {
    margin-bottom: 0.5rem;
}
</style>