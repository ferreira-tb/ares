<script setup lang="ts">
import { computed, ref } from 'vue';
import { useIpcRendererOn } from '@vueuse/electron';
import { NIcon } from 'naive-ui';
import { ipcSend, ipcInvoke } from '$global/ipc';
import type { BackForwardStatus } from '$types/view';

import {
    ArrowBackSharp,
    ArrowForwardSharp,
    HomeSharp,
    ReloadSharp,
    SettingsSharp
} from '@vicons/ionicons5';

const canGoBack = ref<boolean>(await ipcInvoke('current-view-can-go-back'));
const canGoForward = ref<boolean>(await ipcInvoke('current-view-can-go-forward'));

const goBackDepth = computed(() => canGoBack.value ? 3 : 5);
const goForwardDepth = computed(() => canGoForward.value ? 3 : 5);

useIpcRendererOn('current-view-back-forward-status', (_e, status: BackForwardStatus) => {
    canGoBack.value = status.canGoBack;
    canGoForward.value = status.canGoForward;
});
</script>

<template>
    <div class="main-window-menu">
        <div class="menu-icon-area">
            <div class="menu-icon" @click="ipcSend('current-view-go-back')">
                <NIcon :size="22" :depth="goBackDepth" :component="ArrowBackSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-view-go-forward')">
                <NIcon :size="22" :depth="goForwardDepth" :component="ArrowForwardSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('reload-current-view')">
                <NIcon :size="22" :depth="3" :component="ReloadSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-view-go-home')">
                <NIcon :size="22" :depth="3" :component="HomeSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-settings-window', 'general-config')">
                <NIcon :size="22" :depth="3" :component="SettingsSharp" />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@use '$main/assets/main.scss';

.main-window-menu {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;

    width: 100%;
    height: 40px;

    display: flex;
    align-items: center;
    user-select: none;
    -webkit-app-region: no-drag;
}

.menu-icon-area {
    @include main.display-flex-center;
    width: 100%;
    height: 100%;

    & > .menu-icon {
        @include main.display-flex-center;
        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    & > .menu-icon:hover {
        background-color: var(--color-background-soft);
        border-radius: 40%;
    }
}
</style>