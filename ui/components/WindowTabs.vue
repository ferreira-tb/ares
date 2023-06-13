<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NTabs, NTab } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { assertInteger } from '$common/guards';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import WindowTabsButtons from '$ui/components/WindowTabsButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';

const tabsContainer = ref<HTMLElement | null>(null);
const { width } = useElementSize(tabsContainer);
const tabsWidth = computed(() => `${width.value - 150}px`);

const allTabs = reactive<Map<Electron.WebContents['id'], string>>(new Map());
const mainViewWebContentsId = await ipcInvoke('main-view:web-contents-id');
const activeView = ref<Electron.WebContents['id']>(mainViewWebContentsId);
watch(activeView, (webContentsId) => ipcSend('current-view:update', webContentsId));

useIpcOn('focus-main-view', () => (activeView.value = mainViewWebContentsId));

useIpcOn('browser-view-created', (_e, webContentsId: number, viewTitle: string) => {
    allTabs.set(webContentsId, viewTitle);
});

useIpcOn('browser-view-destroyed', (_e, webContentsId: number) => {
    // Se a aba que foi fechada era a ativa, a aba principal tomará seu lugar.
    if (webContentsId === activeView.value) {
        activeView.value = mainViewWebContentsId;
    };

    allTabs.delete(webContentsId);
});

useIpcOn('browser-view-title-updated', (_e, webContentsId: number, viewTitle: string) => {
    if (webContentsId === mainViewWebContentsId) return;
    allTabs.set(webContentsId, viewTitle);
});

function destroyBrowserView(webContentsId: Electron.WebContents['id']) {
    assertInteger(webContentsId, `Invalid webContentsId: ${webContentsId}`);
    ipcSend('view:destroy', webContentsId);
};

function renderMainTab() {
    return h('div', [h(LightIcon), h('span', { class: 'main-tab-icon', textContent: 'Ares' })]);
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
.main-window-tabs-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;

    width: 100%;
    height: 40px;
    
    display: flex;
    align-items: center;
    user-select: none;
}

.main-window-tab-area {
    width: v-bind("tabsWidth");
    height: 40px;
}

:global(.main-tab-icon) {
    margin-left: 5px;
}
</style>