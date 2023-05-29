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
        message.success('Tudo certo!');
        emit('export');
    } else if (status === 'error') {
        message.error('Erro ao exportar o registro de erros.');
    };

    loading.value = false;
};
</script>

<template>
    <div class="error-log-button-area">
        <NButton :loading="loading" :disabled="loading" @click="exportLog">
            Exportar
        </NButton>
    </div>
</template>

<style scoped lang="scss">
.error-log-button-area {
    position: absolute;
    top: v-bind("top");
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>