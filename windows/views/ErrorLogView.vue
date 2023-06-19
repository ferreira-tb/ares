<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import { useWindowSize } from '@vueuse/core';
import { NCard, NResult } from 'naive-ui';
import { ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import { toLocaleDateString } from '$renderer/utils/date';
import ErrorLogExportButton from '$windows/components/ErrorLogExportButton.vue';

const locale = await ipcInvoke('app:locale');

const { height: windowHeight } = useWindowSize();
const contentHeight = computed(() => `${windowHeight.value - 50}px`);

const errorCardContainer = ref<HTMLDivElement | null>(null);
const isContainerOverflowing = computed(() => {
    if (errorCardContainer.value) {
        return errorCardContainer.value.scrollHeight > errorCardContainer.value.clientHeight;
    };

    return false;
});

const general = await ipcInvoke('error:get-log') ?? [];
const electron = await ipcInvoke('error:get-electron-log') ?? [];

const errors = ref<(ErrorCard<ElectronErrorLogType | ErrorLogType>)[]>([
    ...general.map((e) => ({ ...e, id: `general-${e.id}` })),
    ...electron.map((e) => ({ ...e, id: `electron-${e.id}` }))
]);

watchEffect(() => errors.value.sort((a, b) => b.time - a.time));

function updateErrorList(err: ElectronErrorLogType | ErrorLogType, type: 'electron' | 'general') {
    const newError = { ...err, id: `${type}-${err.id}` };
    errors.value.push(newError);
};

useIpcOn('error:did-create-log', (_e, err: ErrorLogType) => updateErrorList(err, 'general'));
useIpcOn('error:did-create-electron-log', (_e, err: ErrorLogType) => updateErrorList(err, 'electron'));
</script>

<template>
    <section>
        <template v-if="errors.length > 0">
            <div ref="errorCardContainer" class="error-card-container tb-scrollbar">
                <TransitionGroup name="tb-fade">
                    <NCard v-for="error of errors" :key="error.id" class="error-card" hoverable>
                        <template #header>{{ error.name }}</template>
                        <template #header-extra>{{ toLocaleDateString(error.time, locale) }}</template>
                        <template #default>{{ error.message }}</template>
                    </NCard>
                </TransitionGroup>
            </div>

            <ErrorLogExportButton :top="contentHeight" @export="errors = []" />
        </template>

        <div v-else class="result-sucess">
            <NResult
                status="success"
                title="Tudo certo!"
                description="Nenhum erro registrado :)"
            />
        </div>
    </section>
</template>

<style scoped lang="scss">
.error-card-container {
    position: absolute;
    top: 0;
    bottom: v-bind("contentHeight");
    width: 100%;
    height: v-bind("contentHeight");
    overflow-x: hidden;
    overflow-y: auto;
    user-select: none;
    padding-top: 0.5em;
    padding-left: 0.3em;
    padding-right: v-bind("isContainerOverflowing ? 0 : '0.3em'");
}

.error-card {
    margin-bottom: 0.5em;
    user-select: text;
}
</style>