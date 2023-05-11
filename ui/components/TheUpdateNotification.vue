<script setup lang="ts">
import semverGt from 'semver/functions/gt';
import { computed, watchEffect } from 'vue';
import { useFetch } from '@vueuse/core';
import { NTag } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { AresAPI } from '$global/constants';

const appVersion = await ipcInvoke('app-version');
const { data } = useFetch(AresAPI.Latest).json<LatestVersion>();

const updateAvailable = computed(() => {
    if (!data.value) return false;
    return semverGt(data.value.version, appVersion);
});

watchEffect(async () => {
    if (data.value && updateAvailable.value) {
        const isIgnored = await ipcInvoke('is-ignored-app-version', data.value.version);
        if (isIgnored) return;
        ipcSend('show-update-available-dialog', data.value.version);
    };
});
</script>

<template>
    <div class="update-notification-tag">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="data && updateAvailable" :key="data.version" class="tag-wrapper">
                <NTag class="version-tag" round type="success" size="small" @click="ipcSend('open-app-update-window')">
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