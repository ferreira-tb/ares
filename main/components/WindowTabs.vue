<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import { NTabs, NTab } from 'naive-ui';
import { useIpcRenderer } from '@vueuse/electron';
import { assertInteger } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc';
import WindowButtons from '$main/components/WindowButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import type { WebContents } from 'electron';
import type { CSSProperties } from 'vue';

const tabsContainer = ref<HTMLElement | null>(null);
const { width } = useElementSize(tabsContainer);
const tabsWidth = computed(() => `${width.value - 150}px`);

const allTabs = reactive<Map<WebContents['id'], string>>(new Map());
const mainViewId = await ipcInvoke('main-view-web-contents-id');
const activeView = ref<WebContents['id']>(mainViewId);
watch(activeView, (viewId) => ipcSend('update-current-view', viewId));

const tabStyle: CSSProperties = {
    maxWidth: '200px',
    overflow: 'hidden'
};

const ipcRenderer = useIpcRenderer();
ipcRenderer.on('browser-view-created', (_e, viewId: number, viewTitle: string) => {
    allTabs.set(viewId, viewTitle);
});

ipcRenderer.on('browser-view-destroyed', (_e, viewId: number) => {
    allTabs.delete(viewId);
});

ipcRenderer.on('browser-view-title-updated', (_e, viewId: number, viewTitle: string) => {
    if (viewId === mainViewId) return;
    allTabs.set(viewId, viewTitle);
});

function destroyBrowserView(viewId: WebContents['id']) {
    assertInteger(viewId);
    ipcSend('destroy-browser-view', viewId);
};

function renderMainTab() {
    return h('div', [h(LightIcon), h('span', 'Ares')]);
};
</script>

<template>
    <div class="main-window-tabs-container" ref="tabsContainer">
        <div class="main-window-tab-area">
            <NTabs
                closable
                type="card"
                trigger="click"
                v-model:value="activeView"
                @close="destroyBrowserView"
                :tab-style="tabStyle"
            >
                <NTab
                    :name="mainViewId"
                    :key="mainViewId"
                    :closable="false"
                    :tab="renderMainTab"
                />

                <NTab
                    v-for="[viewId, title] in allTabs"
                    :name="viewId"
                    :key="viewId"
                    :tab="title"
                />
            </NTabs>
        </div>

        <!-- Botões para controle da janela -->
        <Suspense>
            <WindowButtons />
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
    -webkit-app-region: no-drag;
}
</style>