<script setup lang="ts">
import { ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

defineProps<{
    top: string;
}>();

const emit = defineEmits<{
    (e: 'export'): void;
}>();

const message = useMessage();
const loading = ref(false);

async function exportLog() {
    loading.value = true;
    const status = await ipcInvoke('error:export');
    if (status === 'sucess') {
        message.success('Exportação concluída com sucesso');
        emit('export');
    } else if (status === 'error') {
        message.error('Erro ao exportar o registro de erros');
    }

    loading.value = false;
}
</script>

<template>
    <div id="error-log-button-area">
        <NButton :loading="loading" :disabled="loading" @click="exportLog">
            Exportar
        </NButton>
    </div>
</template>

<style scoped lang="scss">
@use '$windows/assets/main.scss';

#error-log-button-area {
    @include main.flex-x-center-y-center($width: 100%);
    position: absolute;
    top: v-bind("top");
    bottom: 0;
}
</style>