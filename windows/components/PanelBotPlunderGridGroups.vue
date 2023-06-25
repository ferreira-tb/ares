<script setup lang="ts">
import { NDivider, NGrid, NGridItem, NInputNumber } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import { formatFields, parseFields, formatMilliseconds, parseMilliseconds } from '$renderer/utils/format-input';
import GroupsButtonUpdate from '$renderer/components/GroupsButtonUpdate.vue';

const config = usePlunderConfigStore();
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Grupo</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Campos por onda</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.fieldsPerWave"
                    class="config-input"
                    :disabled="config.mode !== 'group'"
                    :min="5"
                    :max="9999"
                    :step="1"
                    :validator="(v) => Number.isFinite(v) && v >= 1"
                    :format="formatFields"
                    :parse="parseFields"
                />
            </NGridItem>

            <NGridItem>
                <div class="config-label">Delay entre troca de aldeias</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.villageDelay"
                    class="config-input"
                    :disabled="config.mode !== 'group'"
                    :min="100"
                    :max="60000"
                    :step="100"
                    :validator="(v) => Number.isInteger(v) && v >= 100 && v <= 60000"
                    :format="formatMilliseconds"
                    :parse="parseMilliseconds"
                />
            </NGridItem>

            <NGridItem :span="2">
                <GroupsButtonUpdate />
            </NGridItem>
        </NGrid>
    </div>
</template>