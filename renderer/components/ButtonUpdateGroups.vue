<script setup lang="ts">
import { ref } from 'vue';
import { useVModel } from '@vueuse/core';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import type { VillageGroup } from '$types/game';

const props = defineProps<{
    groups: Set<VillageGroup>;
}>();

const emit = defineEmits<{
    (event: 'update:groups', groups: Set<VillageGroup>): void;
}>();

const message = useMessage();
const loading = ref(false);
const groups = useVModel(props, 'groups', emit);

async function fetchVillageGroups() {
    loading.value = true;
    const fetched = await ipcInvoke('fetch-village-groups');
    if (fetched) {
        groups.value = await ipcInvoke('get-village-groups');
        message.success('Lista de grupos atualizada');
    } else {
        message.error('Erro ao atualizar a lista de grupos');
    };

    loading.value = false;
};
</script>

<template>
    <div class="grid-button-area">
        <NButton :loading="loading" :disabled="loading" @click="fetchVillageGroups">
            Atualizar grupos
        </NButton>
    </div>
</template>

<style scoped>
.grid-button-area {
    display: flex;
    justify-content: center;
}
</style>