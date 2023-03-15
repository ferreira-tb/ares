<script setup lang="ts">
import { ref } from 'vue';
import { ipcSend, ipcInvoke } from '$global/ipc';

const maximized = ref<boolean>(true);
maximized.value = await ipcInvoke('is-main-window-maximized');

const minimize = () => ipcSend('minimize-main-window');
const close = () => ipcSend('close-main-window');

async function maximizeOrRestore() {
    if (maximized.value === true) {
        ipcSend('restore-main-window');
    } else {
        ipcSend('maximize-main-window');
    };
    
    maximized.value = await ipcInvoke('is-main-window-maximized');
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
@mixin display-flex-center {
    display: flex;
    align-items: center;
    align-content: center;
    height: 100%;
}

.main-window-button-area {
    @include display-flex-center;
    -webkit-app-region: no-drag;
    justify-content: space-between;
    justify-self: end;
    width: max-content;
}

.main-window-button-area > div {
    @include display-flex-center;
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