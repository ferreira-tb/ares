<script setup lang="ts">
import { computed, ref } from 'vue';
import { useElementSize, useMediaQuery } from '@vueuse/core';
import { NIcon } from 'naive-ui';
import { ViewQuiltSharp } from '@vicons/material';
import { ipcSend, ipcInvoke } from '$renderer/ipc';
import { useIpcOn, useTagsConfig, useUserAlias } from '$renderer/composables';
import { StandardWindowName } from '$common/enum';
import TagIncomingHandler from '$ui/components/TagIncomingHandler.vue';
import TagMintingStatus from '$ui/components/TagMintingStatus.vue';
import TagNextIncoming from '$ui/components/TagNextIncoming.vue';
import TagResponseTime from '$ui/components/TagResponseTime.vue';
import TagUpdateNotification from '$ui/components/TagUpdateNotification.vue';
import {
    ArrowBackSharp,
    ArrowForwardSharp,
    BugSharp,
    HomeSharp,
    ReloadSharp,
    SettingsSharp
} from '@vicons/ionicons5';

const userAlias = useUserAlias();
const tagsConfig = useTagsConfig();

const mainWindowMenu = ref<HTMLElement | null>(null);
const { width } = useElementSize(mainWindowMenu);
const menuWidth = computed(() => `${width.value - 300}px`);
const isSmallScreen = useMediaQuery('(max-width: 800px)');

const canGoBack = ref<boolean>(await ipcInvoke('current-tab:can-go-back'));
const canGoForward = ref<boolean>(await ipcInvoke('current-tab:can-go-forward'));

const goBackDepth = computed(() => canGoBack.value ? 3 : 5);
const goForwardDepth = computed(() => canGoForward.value ? 3 : 5);

useIpcOn('tab:back-forward-status', (_e, status: BackForwardStatus) => {
    canGoBack.value = status.canGoBack;
    canGoForward.value = status.canGoForward;
});
</script>

<template>
    <div ref="mainWindowMenu" class="main-window-menu">
        <div class="menu-icon-area">
            <div class="menu-icon" @click="ipcSend('current-tab:back')">
                <NIcon :size="22" :depth="goBackDepth" :component="ArrowBackSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-tab:forward')">
                <NIcon :size="22" :depth="goForwardDepth" :component="ArrowForwardSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-tab:reload')">
                <NIcon :size="22" :depth="3" :component="ReloadSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('current-tab:home')">
                <NIcon :size="22" :depth="3" :component="HomeSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('window:open', StandardWindowName.PanelBotOverview)">
                <NIcon :size="26" :depth="3" :component="ViewQuiltSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('window:open', StandardWindowName.ConfigGeneral)">
                <NIcon :size="22" :depth="3" :component="SettingsSharp" />
            </div>
            <div class="menu-icon" @click="ipcSend('menu:bug')">
                <NIcon :size="22" :depth="3" :component="BugSharp" />
            </div>
        </div>

        <Suspense>
            <div v-show="!isSmallScreen" class="menu-tag-area">
                <TagIncomingHandler :user-alias="userAlias" />
                <TagNextIncoming v-show="tagsConfig?.nextIncoming" :user-alias="userAlias" />
                <TagMintingStatus v-show="tagsConfig?.snob" :user-alias="userAlias" />
                <TagUpdateNotification />
                <TagResponseTime v-show="tagsConfig?.responseTime" :user-alias="userAlias" />
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