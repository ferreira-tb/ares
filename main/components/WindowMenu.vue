<script setup lang="ts">
import { shell } from 'electron';
import { computed, ref } from 'vue';
import { useElementSize, useMediaQuery } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { NIcon } from 'naive-ui';
import { DiscordSharp } from '@vicons/material';
import { ipcSend, ipcInvoke } from '$global/ipc';
import { discordURL } from '$global/utils/constants';
import TheResponseTime from '$main/components/TheResponseTime.vue';
import TheUpdateNotification from '$main/components/TheUpdateNotification.vue';
import type { BackForwardStatus } from '$types/view';

import {
    ArrowBackSharp,
    ArrowForwardSharp,
    HomeSharp,
    ReloadSharp,
    SettingsSharp,
    EarthSharp,
    BugSharp,
    LogoGithub
} from '@vicons/ionicons5';

const mainWindowMenu = ref<HTMLElement | null>(null);
const { width } = useElementSize(mainWindowMenu);
const menuWidth = computed(() => `${width.value - 300}px`);
const isSmallScreen = useMediaQuery('(max-width: 600px)');

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
    <div ref="mainWindowMenu" class="main-window-menu">
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
            <div class="menu-icon" @click="ipcSend('open-settings-window', 'config-general')">
                <NIcon :size="22" :depth="3" :component="SettingsSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-region-select-menu')">
                <NIcon :size="22" :depth="3" :component="EarthSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-bug-report-menu')">
                <NIcon :size="22" :depth="3" :component="BugSharp" />
            </div>
            <div class="menu-icon" @click="shell.openExternal(discordURL)">
                <NIcon :size="22" :depth="3" :component="DiscordSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-github-repo')">
                <NIcon :size="22" :depth="3" :component="LogoGithub" />
            </div>
        </div>

        <div v-show="!isSmallScreen" class="menu-tag-area">
            <TheUpdateNotification />
            <TheResponseTime />
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

    display: flex;
    align-items: center;

    width: 100%;
    height: 40px;
    user-select: none;
    -webkit-app-region: no-drag;
}

.menu-icon-area {
    @include main.display-flex-center;
    width: v-bind("menuWidth");
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

.menu-tag-area {
    @include main.display-flex-center;
    justify-content: end;
    width: 300px;
}
</style>