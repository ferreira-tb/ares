<script setup lang="ts">
import semverGt from 'semver/functions/gt';
import { computed, watchEffect } from 'vue';
import { useFetch } from '@vueuse/core';
import { NTag } from 'naive-ui';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { MainWindowError } from '$ui/error';
import { AresAPI, StandardWindowName } from '$common/enum';

const appVersion = await ipcInvoke('app:version');
const { data, onFetchError } = useFetch(AresAPI.Latest).json<LatestVersion>();
onFetchError(MainWindowError.catch);

const updateAvailable = computed(() => {
    if (!data.value) return false;
    return semverGt(data.value.version, appVersion);
});

watchEffect(async () => {
    if (data.value && updateAvailable.value) {
        const isIgnored = await ipcInvoke('app-update:is-ignored-version', data.value.version);
        if (isIgnored) return;
        ipcSend('update:update-available-dialog', data.value.version);
    }
});
</script>

<template>
    <div class="update-notification-tag-container">
        <Transition name="tb-fade" mode="out-in">
            <div v-if="data && updateAvailable" :key="data.version" class="tag-wrapper">
                <NTag 
                    class="update-notification-tag"
                    type="success"
                    size="small"
                    round
                    @click="ipcSend('window:open', StandardWindowName.Update)"
                >
                    Nova versão disponível
                </NTag>
            </div>
        </Transition>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.update-notification-tag-container {
    @include ui.ui-tag;

    .tag-wrapper {
        @include ui.tag-wrapper;

        .update-notification-tag {
            cursor: pointer;
        }
    }
}
</style>