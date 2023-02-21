<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { NCard } from 'naive-ui';
import { assertArray, assertInteger } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { getLocaleDateString } from '$global/utils/helpers.js';
import { ModuleError } from '$modules/error.js';
import type { ErrorLogType } from '$types/error.js';

const raw = await ipcInvoke('get-main-process-error-log');
assertArray(raw, 'Houve um erro durante a conexão com o banco de dados.');
const errors = reactive(raw);
watchEffect(() => errors.sort((a, b) => b.time - a.time));

const ipcRenderer = useIpcRenderer();
ipcRenderer.on('main-process-error-log-updated', (_e, newError: ErrorLogType) => errors.push(newError));

function deleteError(id: number) {
    assertInteger(id, 'O ID do erro deve ser um número inteiro.');
    ipcSend('delete-main-process-error-log', id);

    const index = errors.findIndex((error) => error.id === id);
    if (index === -1) throw new ModuleError('Não foi possível remover o erro da lista.');
    errors.splice(index, 1);
};
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <TransitionGroup name="fade" mode="out-in">
                <NCard
                    v-for="error of errors"
                    :key="error.id"
                    class="error-log"
                    hoverable closable
                    @close="deleteError(error.id)"
                >
                    <template #header>{{ error.name }}</template>
                    <template #header-extra>{{ getLocaleDateString(error.time, true) }}</template>
                    <template #default>{{ error.message }}</template>
                </NCard>
            </TransitionGroup>
        </template>
        <div v-else class="nothing-to-show">
            Nenhum erro registrado :)
        </div>
    </section>
</template>

<style scoped>
.error-log {
    margin-bottom: 0.5em;
}

.error-log:last-of-type {
    margin-bottom: 1em;
}
</style>