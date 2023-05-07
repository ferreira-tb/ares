<script setup lang="ts">
import { computed, ref, watch, watchEffect } from 'vue';
import { NDivider, NGrid, NGridItem, NSelect } from 'naive-ui';
import { isInteger } from '$global/guards';
import { isDistance } from '$global/guards';
import { ipcInvoke } from '$renderer/ipc';
import InputNumber from '$renderer/components/InputNumber.vue';
import LabelPopover from '$renderer/components/LabelPopover.vue';
import ButtonGroupsUpdate from '$renderer/components/ButtonGroupsUpdate.vue';
import type { PlunderConfigType } from '$types/plunder';

const props = defineProps<{
    config: PlunderConfigType;
}>();

const emit = defineEmits<{
    <T extends keyof PlunderConfigType>(event: 'update:config', name: T, value: PlunderConfigType[T]): void;
}>();

const previousGroups = await ipcInvoke('get-village-groups');
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
                <LabelPopover>
                    <template #trigger>Grupo de ataque</template>
                    <span>Determina qual grupo será utilizado ao se atacar em grupo. Apenas grupos dinâmicos são permitidos.</span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <div class="plunder-config-select">
                    <NSelect
                        v-model:value="plunderGroupId"
                        :options="plunderGroupOptions"
                        placeholder="Selecione um grupo"
                        :disabled="plunderGroupOptions.length === 0"
                    />
                </div>
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Campos por onda</template>
                    <span>
                        Ao atacar em grupos, o Ares não envia todos os ataques de uma só vez.
                        Em vez disso, ele envia uma onda de ataques de uma aldeia e então passa para a próxima,
                        repetindo o processo até que todas as aldeias tenham enviado seus ataques.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber v-model:value="fieldsPerWave" :min="5" :max="9999" :step="1" :validator="(v) => isDistance(v)" />
            </NGridItem>

            <NGridItem>
                <LabelPopover>
                    <template #trigger>Delay entre troca de aldeias</template>
                    <span>
                        Determina quantos milissegundos o Ares deve esperar antes de trocar de aldeia ao atacar em grupo.
                    </span>
                </LabelPopover>
            </NGridItem>
            <NGridItem>
                <InputNumber
                    v-model:value="villageDelay"
                    :min="100"
                    :max="60000"
                    :step="100"
                    :validator="(v) => isInteger(v) && v >= 100 && v <= 60000"
                />
            </NGridItem>

            <NGridItem :span="2">
                <ButtonGroupsUpdate v-model:groups="groups" />
            </NGridItem>
        </NGrid>
    </div>
</template>