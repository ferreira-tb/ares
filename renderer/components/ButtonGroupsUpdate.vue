<script setup lang="ts">
import { computed, ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

const props = defineProps<{
    groups: Set<VillageGroup>;
}>();

const emit = defineEmits<{
    (event: 'update:groups', groups: Set<VillageGroup>): void;
}>();

const message = useMessage();
const loading = ref(false);
const groups = useVModel(props, 'groups', emit);

const buttonText = computed(() => {
    if (loading.value) return 'Atualizando grupos...';
    return 'Atualizar grupos';
});

async function fetchVillageGroups() {
    loading.value = true;
    const fetched = await ipcInvoke('game:fetch-village-groups');
    if (fetched) {
        groups.value = await ipcInvoke('game:get-all-village-groups');
        message.success('Lista de grupos atualizada');
    } else {
        message.error('Erro ao atualizar a lista de grupos');
    };

    loading.value = false;
};
</script>

<template>
    <div class="button-groups-update">
        <NButton :loading="loading" :disabled="loading" @click="fetchVillageGroups">
            {{ buttonText }}
        </NButton>
    </div>
</template>

<style scoped lang="scss">
@use '$renderer/assets/utils.scss';

.button-groups-update {
    @include utils.flex-x-center-y-center;
}
</style>