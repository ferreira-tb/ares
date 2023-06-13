<script setup lang="ts">
import { computed, ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

const message = useMessage();
const loading = ref(false);

const buttonText = computed(() => {
    if (loading.value) return 'Atualizando grupos...';
    return 'Atualizar grupos';
});

async function fetchVillageGroups() {
    loading.value = true;
    const fetched = await ipcInvoke('game:fetch-village-groups');
    if (fetched) {
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