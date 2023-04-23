<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { NCard } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { getLocaleDateString } from '$global/helpers';
import { ModuleError } from '$modules/error';
import type { ErrorLogType } from '$types/error';
import ResultSucess from '$renderer/components/ResultSucess.vue';

const raw = await ipcInvoke('error:get-electron-log');
if (!Array.isArray(raw)) throw new ModuleError('Database connection error.');

const errors = reactive(raw);
watchEffect(() => errors.sort((a, b) => b.time - a.time));

useIpcRendererOn('electron-error-log-did-update', (_e, newError: ErrorLogType) => errors.push(newError));

function deleteError(id: number) {
    ipcSend('error:delete-electron-log', id);
    const index = errors.findIndex((error) => error.id === id);
    if (index === -1) throw new ModuleError(`Could not find error with ID ${id}.`);
    errors.splice(index, 1);
};
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <TransitionGroup name="tb-fade">
                <NCard
                    v-for="error of errors"
                    :key="error.id"
                    class="error-log"
                    hoverable
                    closable
                    @close="deleteError(error.id)"
                >
                    <template #header>{{ error.name }}</template>
                    <template #header-extra>{{ getLocaleDateString(error.time, true) }}</template>
                    <template #default>{{ error.message }}</template>
                </NCard>
            </TransitionGroup>
        </template>
        <ResultSucess v-else description="Nenhum erro registrado :)" />
    </section>
</template>