<script setup lang="ts">
import { ref } from 'vue';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';

const maximized = ref<boolean>(await ipcInvoke('ui:is-maximized'));

useIpcOn('ui:did-update-maximize-status', (_e, status: boolean) => {
    maximized.value = status;
});
</script>

<template>
    <div class="main-window-button-area">
        <div @click="ipcSend('ui:minimize')"><span class="mdl2-chrome-minimize"></span></div>
        <div @click="ipcSend('ui:maximize')">
            <span v-if="maximized" class="mdl2-chrome-restore"></span>
            <span v-else class="mdl2-chrome-maximize"></span>
        </div>
        <div @click="ipcSend('ui:close')"><span class="mdl2-chrome-close"></span></div>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

.main-window-button-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    width: 150px;
    height: 100%;
    -webkit-app-region: no-drag;
}

.main-window-button-area > div {
    @include ui.display-flex-center;
    padding-left: 1em;
    padding-right: 1em;
}

.main-window-button-area > div:has(:not(.mdl2-chrome-close)) {
    &:hover {
        background-color: var(--color-background-soft);
    }
}

.main-window-button-area > div:has(.mdl2-chrome-close) {
    &:hover {
        background-color: var(--color-red);
    }
}
</style>