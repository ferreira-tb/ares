<script setup lang="ts">
import { ref } from 'vue';
import { NButton, useMessage } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';

defineProps<{
    buttonTop: string;
}>();

const message = useMessage();
const loading = ref(false);

async function exportLog() {
    loading.value = true;
    const status = await ipcInvoke('error:export');
    if (status === 'sucess') {
        message.success('Tudo certo!');
    } else if (status === 'error') {
        message.error('Erro ao exportar o registro de erros.');
    };

    loading.value = false;
};
</script>

<template>
    <div class="btn-error-export">
        <NButton :loading="loading" :disabled="loading" @click="exportLog">
            Exportar
        </NButton>
    </div>
</template>

<style scoped lang="scss">
.btn-error-export {
    position: absolute;
    top: v-bind("buttonTop");
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
}
</style>