<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { NDivider, NGrid, NGridItem, NInputNumber, NSelect } from 'naive-ui';
import { formatFields, parseFields, formatMilliseconds, parseMilliseconds } from '$modules/utils/input-parser';
import { ipcInvoke } from '$renderer/ipc';
import ButtonGroupsUpdate from '$renderer/components/ButtonGroupsUpdate.vue';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(e: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const previousGroups = await ipcInvoke('game:get-village-groups');
const groups = ref(previousGroups);

const plunderGroupOptions = computed(() => {
    const groupsArray = Array.from(groups.value).filter((group) => group.type === 'dynamic');
    const options = groupsArray.map((group) => ({
        label: decodeURIComponent(group.name),
        value: group.id
    }));

    return options.sort((a, b) => a.label.localeCompare(b.label, 'pt-br'));
});

const plunderGroupId = ref<number | null>(props.config.plunderGroupId);
const fieldsPerWave = ref<number>(props.config.fieldsPerWave);
const villageDelay = ref<number>(props.config.villageDelay);

watch(plunderGroupId, (v) => emit('update:config', 'plunderGroupId', v));
watch(fieldsPerWave, (v) => emit('update:config', 'fieldsPerWave', v));
watch(villageDelay, (v) => emit('update:config', 'villageDelay', v));

watchEffect(() => {
    const plunderGroup = Array.from(groups.value).find((group) => group.id === plunderGroupId.value);
    if (plunderGroup?.type !== 'dynamic') plunderGroupId.value = null;
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
                        v-model:value="plunderGroupId"
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
                    v-model:value="fieldsPerWave"
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
                    v-model:value="villageDelay"
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
                <ButtonGroupsUpdate v-model:groups="groups" />
            </NGridItem>
        </NGrid>
    </div>
</template>