<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NTabs, NTab } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { useIpcRendererOn } from '@vueuse/electron';
import { assertInteger } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc';
import WindowTabsButtons from '$main/components/WindowTabsButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import type { WebContents } from 'electron';

const tabsContainer = ref<HTMLElement | null>(null);
const { width } = useElementSize(tabsContainer);
const tabsWidth = computed(() => `${width.value - 150}px`);

const allTabs = reactive<Map<WebContents['id'], string>>(new Map());
const mainViewWebContentsId = await ipcInvoke('main-view-web-contents-id');
const activeView = ref<WebContents['id']>(mainViewWebContentsId);
watch(activeView, (webContentsId) => ipcSend('update-current-view', webContentsId));

useIpcRendererOn('focus-main-view', () => (activeView.value = mainViewWebContentsId));

useIpcRendererOn('browser-view-created', (_e, webContentsId: number, viewTitle: string) => {
    allTabs.set(webContentsId, viewTitle);
});

useIpcRendererOn('browser-view-destroyed', (_e, webContentsId: number) => {
    // Se a aba que foi fechada era a ativa, a aba principal tomará seu lugar.
    if (webContentsId === activeView.value) {
        activeView.value = mainViewWebContentsId;
    };

    allTabs.delete(webContentsId);
});

useIpcRendererOn('browser-view-title-updated', (_e, webContentsId: number, viewTitle: string) => {
    if (webContentsId === mainViewWebContentsId) return;
    allTabs.set(webContentsId, viewTitle);
});

function destroyBrowserView(webContentsId: WebContents['id']) {
    assertInteger(webContentsId);
    ipcSend('destroy-browser-view', webContentsId);
};

function renderMainTab() {
    return h('div', [h(LightIcon), h('span', 'Ares')]);
};
</script>

<template>
    <div ref="tabsContainer" class="main-window-tabs-container">
        <div class="main-window-tab-area">
            <NTabs
                v-model:value="activeView"
                closable
                type="card"
                trigger="click"
                tab-style="-webkit-app-region: no-drag;"
                @close="destroyBrowserView"
            >
                <NTab
                    :key="mainViewWebContentsId"
                    :name="mainViewWebContentsId"
                    :closable="false"
                    :tab="renderMainTab"
                />

                <NTab
                    v-for="[viewId, title] of allTabs"
                    :key="viewId"
                    :name="viewId"
                    :tab="title"
                />
            </NTabs>
        </div>

        <!-- Botões para controle da janela -->
        <Suspense>
            <WindowTabsButtons />
        </Suspense>
    </div>
</template>

<style scoped lang="scss">
@use '$main/assets/main.scss';

.main-window-tabs-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    width: 100%;
    height: main.$tab-height;
    
    display: flex;
    align-items: center;
    user-select: none;
}

.main-window-tab-area {
    width: v-bind("tabsWidth");
    height: main.$tab-height;
}
</style>