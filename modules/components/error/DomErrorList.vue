<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useIpcRenderer } from '@vueuse/electron';
import { NCard } from 'naive-ui';
import { assertInteger, assertArray } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc.js';
import { getLocaleDateString } from '$global/utils/helpers.js';
import { ModuleError } from '$modules/error.js';
import type { DOMErrorLogType } from '$types/error.js';
import SucessResult from '$vue/components/result/SuccessResult.vue';

const raw = await ipcInvoke('get-dom-error-log');
assertArray(raw, 'Houve um erro durante a conexão com o banco de dados.');
const errors = reactive(raw);
watchEffect(() => errors.sort((a, b) => b.time - a.time));

const ipcRenderer = useIpcRenderer();
ipcRenderer.on('dom-error-log-updated', (_e, newError: DOMErrorLogType) => errors.push(newError));

function deleteError(id: number) {
    assertInteger(id, 'O ID do erro deve ser um número inteiro.');
    ipcSend('delete-dom-error-log', id);

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
                    <template #default>{{ error.selector }}</template>
                </NCard>
            </TransitionGroup>
        </template>
        <SucessResult v-else description="Nenhum erro registrado :)" />
    </section>
</template>