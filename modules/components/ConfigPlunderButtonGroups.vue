<script setup lang="ts">
import { ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$global/ipc';
import type { VillageGroup } from '$types/game';

const emit = defineEmits<{
    (event: 'update-groups', groups: Set<VillageGroup>): void;
}>();

const loading = ref(false);
const message = useMessage();

async function fetchVillageGroups() {
    loading.value = true;
    const fetched = await ipcInvoke('fetch-village-groups');
    if (fetched) {
        const groups = await ipcInvoke('get-village-groups');
        emit('update-groups', groups);
        message.success('Lista de grupos atualizada');
    } else {
        message.error('Erro ao atualizar a lista de grupos');
    };

    loading.value = false;
};
</script>

<template>
    <div class="grid-button-area">
        <NButton :loading="loading" :disabled="loading" @click="() => fetchVillageGroups()">
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