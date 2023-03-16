<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { NTabs, NTab } from 'naive-ui';
import { useIpcRenderer } from '@vueuse/electron';
import { assertInteger } from '@tb-dev/ts-guard';
import { ipcInvoke, ipcSend } from '$global/ipc';
import WindowButtons from '$main/components/WindowButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import type { WebContents } from 'electron';
import type { CSSProperties } from 'vue';

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
</script>

<template>
    <div class="main-window-tabs-container">
        <div class="main-window-tab-area">
            <div class="main-browser-view-tab" @click="activeView = mainViewId">
                <LightIcon /> <span class="main-browser-view-title">Ares</span>
            </div>
            <div class="other-browser-view-tabs">
                <NTabs
                    type="card"
                    trigger="click"
                    v-model:value="activeView"
                    @close="destroyBrowserView"
                    :tab-style="tabStyle"
                >
                    <NTab
                        v-for="[viewId, title] in allTabs"
                        closable
                        :name="viewId"
                        :key="viewId"
                        :tab="title"
                    />
                </NTabs>
            </div>
        </div>

        <!-- Botões para controle da janela -->
        <Suspense>
            <WindowButtons />
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
    display: flex;
    align-items: center;
    justify-self: start;

    width: 100%;
    height: 100%;
    -webkit-app-region: no-drag;

    & > div {
        height: 100%;
    }

    .main-browser-view-tab {
        display: flex;
        align-items: center;
        align-content: center;
        justify-content: center;

        width: 100px;
        border-radius: 10%;
        margin-right: 0.3em;

        color: var(--color-text);
        background-color: var(--color-background-mute);

        & > .main-browser-view-title {
            margin-left: 0.2em;
        }
    }
}
</style>