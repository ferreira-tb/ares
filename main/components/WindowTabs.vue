<script setup lang="ts">
import { ref, reactive } from 'vue';
import { NTabs, NTab } from 'naive-ui';
import { useIpcRenderer } from '@vueuse/electron';
import { ipcInvoke } from '$global/ipc';
import WindowButtons from '$main/components/WindowButtons.vue';
import LightIcon from '$icons/units/LightIcon.vue';
import type { WebContents } from 'electron';
import type { CSSProperties } from 'vue';

const mainViewId = await ipcInvoke('main-view-web-contents-id');
const activeView = ref<WebContents['id']>(mainViewId);
const allTabs = reactive<Map<WebContents['id'], string>>(new Map());

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
</script>

<template>
    <div class="main-window-tabs-container">
        <div class="main-window-tab-area">
            <div class="main-browser-view-tab">
                <LightIcon /> <span class="main-browser-view-title">Ares</span>
            </div>
            <div class="other-browser-view-tabs">
                <NTabs
                    type="card"
                    v-model:value="activeView"
                    :tab-style="tabStyle"
                    closable
                >
                    <NTab
                        v-for="[viewId, title] in allTabs"
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