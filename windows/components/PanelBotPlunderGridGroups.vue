<script setup lang="ts">
import { computed, toRef } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect, NSwitch } from 'naive-ui';
import { useGameDataStore, usePlunderConfigStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import { useGroups } from '$renderer/composables';
import { formatFields, parseFields, formatMilliseconds, parseMilliseconds } from '$renderer/utils/format-input';
import GroupsButtonUpdate from '$renderer/components/GroupsButtonUpdate.vue';

const props = defineProps<{
    userAlias: UserAlias | null;
}>();

const gameData = useGameDataStore();
const config = usePlunderConfigStore();
const locale = await ipcInvoke('app:locale');

const { groups: dynamicGroups } = useGroups(toRef(() => props.userAlias), { type: 'dynamic' });
const plunderGroupOptions = computed(() => {
    const options = dynamicGroups.value.map((group) => ({
        label: group.name,
        value: group.id
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label, locale));
});

const canUseGroupAttack = computed(() => {
    if (gameData.features.premium === false) return false;
    return dynamicGroups.value.length > 0;
});
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Grupo</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem :span="2">
                <div class="labeled-switch-wrapper">
                    <NSwitch v-model:value="config.groupAttack" round size="small" :disabled="!canUseGroupAttack" />
                    <div class="switch-label">Ataque em grupo</div>
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Grupo de ataque</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect
                        v-model:value="config.plunderGroupId"
                        placeholder="Selecione um grupo"
                        :options="plunderGroupOptions"
                        :disabled="!config.groupAttack || plunderGroupOptions.length === 0"
                    />
                </div>
            </NGridItem>

            <NGridItem>
                <div class="config-label">Campos por onda</div>
            </NGridItem>
            <NGridItem>
                <NInputNumber
                    v-model:value="config.fieldsPerWave"
                    class="config-input"
                    :disabled="!config.groupAttack"
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
                    :disabled="!config.groupAttack"
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

<style scoped lang="scss">
.labeled-switch-wrapper {
    margin-bottom: 0.5rem;
}
</style>