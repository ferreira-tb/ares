<script setup lang="ts">
import semverGt from 'semver/functions/gt';
import { computed, watchEffect } from 'vue';
import { useFetch } from '@vueuse/core';
import { NTag } from 'naive-ui';
import { ipcInvoke } from '$global/ipc';

type LatestVersion = {
    readonly version: string;
    readonly notes: string;
    readonly download: string;
};

const appVersion = await ipcInvoke('app-version');
const { data } = useFetch('https://tb.dev.br/ares/latest.json').json<LatestVersion>();

const updateAvailable = computed(() => {
    if (!data.value) return false;
    return semverGt(data.value.version, appVersion);
});

watchEffect(async () => {
    if (data.value && updateAvailable.value) {
        const isIgnored = await ipcInvoke('is-ignored-app-version', data.value.version);
        if (isIgnored) return;

        const shouldDownload = await ipcInvoke('show-update-available-dialog', data.value.version);
        if (shouldDownload) return; // TODO
    };
});
</script>

<template>
    <div class="update-notification-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="data && updateAvailable" :key="data.version" class="tag-wrapper">
                <NTag round type="success" size="small" class="version-tag">
                    Nova versão disponível
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
.update-notification-tag {
    width: max-content;
    height: 100%;

    .tag-wrapper {
        display: flex;
        align-items: center;
        justify-content: end;
        
        width: inherit;
        height: inherit;
        padding-right: 0.5rem;
        
        .version-tag {
            cursor: pointer;
        }
    }
}
</style>