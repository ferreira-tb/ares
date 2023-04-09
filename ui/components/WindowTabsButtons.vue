<script setup lang="ts">
import { ref } from 'vue';
import { ipcSend, ipcInvoke } from '$renderer/ipc';

const maximized = ref<boolean>(true);
maximized.value = await ipcInvoke('is-main-window-maximized');

const minimize = () => ipcSend('minimize-main-window');
const close = () => ipcSend('close-main-window');

async function maximizeOrRestore() {
    const status = await ipcInvoke('maximize-or-restore-main-window');
    maximized.value = status;
};
</script>

<template>
    <div class="main-window-button-area">
        <div @click="minimize"><span class="mdl2-chrome-minimize"></span></div>
        <div @click="maximizeOrRestore">
            <span v-if="maximized" class="mdl2-chrome-restore"></span>
            <span v-else class="mdl2-chrome-maximize"></span>
        </div>
        <div @click="close"><span class="mdl2-chrome-close"></span></div>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss';

.main-window-button-area {
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    width: 150px;
    height: 100%;
    -webkit-app-region: no-drag;
}

.main-window-button-area > div {
    @include main.display-flex-center;
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