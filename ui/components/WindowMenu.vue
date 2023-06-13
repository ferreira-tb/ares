<script setup lang="ts">
import { shell } from 'electron';
import { computed, ref } from 'vue';
import { useElementSize, useMediaQuery } from '@vueuse/core';
import { NIcon } from 'naive-ui';
import { DiscordSharp } from '@vicons/material';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { useIpcOn, useUserAlias } from '$renderer/composables';
import { WebsiteUrl } from '$common/constants';
import TheIncomingHandler from '$ui/components/TheIncomingHandler.vue';
import TheMintingStatus from '$ui/components/TheMintingStatus.vue';
import TheNextIncoming from '$ui/components/TheNextIncoming.vue';
import TheResponseTime from '$ui/components/TheResponseTime.vue';
import TheUpdateNotification from '$ui/components/TheUpdateNotification.vue';

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

const userAlias = useUserAlias();

const mainWindowMenu = ref<HTMLElement | null>(null);
const { width } = useElementSize(mainWindowMenu);
const menuWidth = computed(() => `${width.value - 300}px`);
const isSmallScreen = useMediaQuery('(max-width: 800px)');

const canGoBack = ref<boolean>(await ipcInvoke('current-view:can-go-back'));
const canGoForward = ref<boolean>(await ipcInvoke('current-view:can-go-forward'));

const goBackDepth = computed(() => canGoBack.value ? 3 : 5);
const goForwardDepth = computed(() => canGoForward.value ? 3 : 5);

useIpcOn('current-view-back-forward-status', (_e, status: BackForwardStatus) => {
    canGoBack.value = status.canGoBack;
    canGoForward.value = status.canGoForward;
});
</script>

<template>
    <div ref="mainWindowMenu" class="main-window-menu">
        <div class="menu-icon-area">
            <div class="menu-icon" @click="ipcSend('current-view:back')">
                <NIcon :size="22" :depth="goBackDepth" :component="ArrowBackSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-view:forward')">
                <NIcon :size="22" :depth="goForwardDepth" :component="ArrowForwardSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-view:reload')">
                <NIcon :size="22" :depth="3" :component="ReloadSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-view:home')">
                <NIcon :size="22" :depth="3" :component="HomeSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('config:open', 'config-general')">
                <NIcon :size="22" :depth="3" :component="SettingsSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-region-select-menu')">
                <NIcon :size="22" :depth="3" :component="EarthSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-bug-report-menu')">
                <NIcon :size="22" :depth="3" :component="BugSharp" />
            </div>
            <div class="menu-icon" @click="shell.openExternal(WebsiteUrl.Discord)">
                <NIcon :size="22" :depth="3" :component="DiscordSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('open-github-repo')">
                <NIcon :size="22" :depth="3" :component="LogoGithub" />
            </div>
        </div>

        <Suspense>
            <div v-show="!isSmallScreen" class="menu-tag-area">
                <TheIncomingHandler :user-alias="userAlias" />
                <TheNextIncoming :user-alias="userAlias" />
                <TheUpdateNotification />
                <TheMintingStatus :user-alias="userAlias" />
                <TheResponseTime :user-alias="userAlias" />
            </div>
        </Suspense>
    </div>
</template>

<style scoped lang="scss">
@use '$ui/assets/main.scss' as ui;

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
    @include ui.display-flex-center;
    width: v-bind("menuWidth");
    height: 100%;

    & > .menu-icon {
        @include ui.display-flex-center;
        padding-left: 0.5em;
        padding-right: 0.5em;
    }

    & > .menu-icon:hover {
        background-color: var(--color-background-soft);
        border-radius: 40%;
    }
}

.menu-tag-area {
    @include ui.display-flex-center;
    justify-content: end;
    width: 300px;
}
</style>