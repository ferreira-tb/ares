<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect } from 'naive-ui';
import { usePlunderConfigStore } from '$renderer/stores';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { decodeString } from '$common/helpers';
import { formatFields, parseFields, formatMilliseconds, parseMilliseconds } from '$windows/utils/input-parser';
import ButtonGroupsUpdate from '$renderer/components/ButtonGroupsUpdate.vue';

const config = usePlunderConfigStore();
const locale = await ipcInvoke('app:locale');
const allGroups = ref(await ipcInvoke('game:get-all-village-groups'));

const plunderGroupOptions = computed(() => {
    const groupsArray = Array.from(allGroups.value).filter((group) => group.type === 'dynamic');
    const options = groupsArray.map((group) => ({
        label: decodeString(group.name),
        value: group.id
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label, locale));
});

watchEffect(() => {
    const plunderGroup = Array.from(allGroups.value).find((group) => group.id === config.plunderGroupId);
    if (plunderGroup?.type !== 'dynamic') config.plunderGroupId = null;
});

useIpcOn('game:did-update-village-groups-set', (_e, groups: Set<VillageGroup>) => {
    allGroups.value = groups;
});
</script>

<template>
    <div>
        <NDivider title-placement="left" class="config-divider">Grupo</NDivider>
        <NGrid :cols="2" :x-gap="6" :y-gap="10">
            <NGridItem>
                <div class="config-label">Grupo de ataque</div>
            </NGridItem>
            <NGridItem>
                <div class="config-select">
                    <NSelect
                        v-model:value="config.plunderGroupId"
                        placeholder="Selecione um grupo"
                        :options="plunderGroupOptions"
                        :disabled="plunderGroupOptions.length === 0"
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
                    :min="100"
                    :max="60000"
                    :step="100"
                    :validator="(v) => Number.isInteger(v) && v >= 100 && v <= 60000"
                    :format="formatMilliseconds"
                    :parse="parseMilliseconds"
                />
            </NGridItem>

            <NGridItem :span="2">
                <ButtonGroupsUpdate />
            </NGridItem>
        </NGrid>
    </div>
</template>