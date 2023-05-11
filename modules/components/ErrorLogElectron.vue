<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { NCard } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { getLocaleDateString } from '$global/helpers';
import { ModuleError } from '$modules/error';
import ResultSucess from '$renderer/components/ResultSucess.vue';

const raw = await ipcInvoke('error:get-electron-log');
if (!Array.isArray(raw)) throw new ModuleError('Database connection error.');

const errors = reactive(raw);
watchEffect(() => errors.sort((a, b) => b.time - a.time));

useIpcRendererOn('error:electron-log-did-update', (_e, newError: ErrorLogType) => errors.push(newError));
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <TransitionGroup name="tb-fade">
                <NCard v-for="error of errors" :key="error.id" class="error-log" hoverable>
                    <template #header>{{ error.name }}</template>
                    <template #header-extra>{{ getLocaleDateString(error.time, true) }}</template>
                    <template #default>{{ error.message }}</template>
                </NCard>
            </TransitionGroup>
        </template>
        <ResultSucess v-else description="Nenhum erro registrado :)" />
    </section>
</template>