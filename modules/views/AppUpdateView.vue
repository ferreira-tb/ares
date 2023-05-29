<script setup lang="ts">
import semverGte from 'semver/functions/gte';
import { shell } from 'electron';
import { computed, ref, watch } from 'vue';
import { computedEager, useFetch, useWindowSize } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { NButton, NButtonGroup, NSpin, NProgress } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { WebsiteUrl, AresAPI } from '$shared/constants';
import { ModuleAppUpdateError } from '$modules/error';

const appVersion = await ipcInvoke('app-version');
const { isFetching, error, data } = useFetch(AresAPI.Latest).json<LatestVersion>();

const { width: windowWidth, height: windowHeight } = useWindowSize();
const wentWrong = ref(false);
const isDownloading = ref(false);
const receivedBytes = ref(0);
const totalBytes = ref(0);
const progressBarStatus = ref<'default' | 'error' | 'success'>('default');

const percentage = computedEager(() => {
    if (!isDownloading.value || totalBytes.value === 0) return 0;
    return Math.round((receivedBytes.value / totalBytes.value) * 100);
});

const isLatest = computed(() => {
    if (!data.value) return false;
    return semverGte(appVersion, data.value.version);
});

watch(error, (err: unknown) => {
    if (typeof err === 'string') {
        const message = err.length > 0 ? err : 'Unknown error while fetching from server.';
        err = new ModuleAppUpdateError(message);
    };

    wentWrong.value = err instanceof Error;
    ModuleAppUpdateError.catch(err);
});

useIpcRendererOn('will-download-update', (_e, downloadProgress: DownloadProgressType) => {
    isDownloading.value = true;
    progressBarStatus.value = 'default';
    receivedBytes.value = downloadProgress.receivedBytes;
    totalBytes.value = downloadProgress.totalBytes;
});

useIpcRendererOn('update-download-progress', (_e, downloadProgress: DownloadProgressType) => {
    receivedBytes.value = downloadProgress.receivedBytes;
    totalBytes.value = downloadProgress.totalBytes;
});

useIpcRendererOn('update-download-completed', () => {
    isDownloading.value = false;
    progressBarStatus.value = 'success';
});

useIpcRendererOn('update-download-failed', () => {
    isDownloading.value = false;
    progressBarStatus.value = 'error';
});

function downloadUpdate() {
    if (!data.value?.download) return;
    ipcSend('download-from-url', data.value.download);
};

function openChangelog() {
    if (!data.value?.notes) return;
    ipcSend('open-any-allowed-website', data.value.notes);
};
</script>

<template>
    <main class="app-update-view">
        <div class="version-area">
            <NSpin size="small" :show="isFetching">
                <div>
                    <div>Versão atual: {{ appVersion }}</div>
                    <div v-if="isLatest" class="is-latest">Você está com a versão mais recente!</div>
                    <div v-else-if="data">Nova versão: {{ data.version }}</div>
                    <div v-else-if="wentWrong" class="went-wrong" @click="ipcSend('error:open-log-window')">
                        Erro ao verificar a versão mais recente.
                    </div>
                </div>
            </NSpin>
        </div>

        <div class="button-area">
            <NButtonGroup>
                <NButton round :disabled="!data?.download" @click="downloadUpdate">
                    Download
                </NButton>
                <NButton round :disabled="!data?.notes" @click="openChangelog">
                    Changelog
                </NButton>
                <NButton round @click="shell.openExternal(WebsiteUrl.Discord)">
                    Discord
                </NButton>
            </NButtonGroup>
        </div>

        <Transition name="tb-fade" mode="out-in">
            <div v-if="isDownloading || progressBarStatus !== 'default'" class="download-area">
                <NProgress type="circle" :status="progressBarStatus" :percentage="percentage" />
            </div>
        </Transition>
    </main>
</template>

<style scoped lang="scss">
@mixin area-style($margin-top) {
    width: inherit;
    height: max-content;
    margin-top: $margin-top;
}

.app-update-view {
    user-select: none;
    width: v-bind("`${windowWidth}px`");
    height: v-bind("`${windowHeight}px`");
    margin: 0;

    .version-area {
        @include area-style(0.5rem);
        padding-left: 0.5rem;
        padding-right: 0.5rem;
    }

    .is-latest {
        color: var(--color-green);
    }

    .went-wrong {
        cursor: pointer;
        color: var(--color-red);
    }

    .button-area {
        text-align: center;
        @include area-style(1rem);
    }

    .download-area {
        @include area-style(1rem);
        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>