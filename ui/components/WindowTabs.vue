<script setup lang="ts">
import { h, computed, ref, reactive, watch } from 'vue';
import { NTabs, NTab } from 'naive-ui';
import { useElementSize } from '@vueuse/core';
import { ipcInvoke, ipcSend } from '$renderer/ipc';
import { useIpcOn } from '$renderer/composables';
import BrowserTab from '$ui/components/BrowserTab.vue';
import WindowTabsButtons from '$ui/components/WindowTabsButtons.vue';

const tabsContainer = ref<HTMLElement | null>(null);
const { width } = useElementSize(tabsContainer);
const tabsWidth = computed(() => `${width.value - 150}px`);

const allTabs = reactive<number[]>([]);
const mainTabId = await ipcInvoke('main-tab:id');
const currentTabId = ref(mainTabId);
watch(currentTabId, (tabId) => ipcSend('tab:set-current', tabId));

useIpcOn('main-tab:focus', () => {
    currentTabId.value = mainTabId;
});

useIpcOn('tab:created', (_e, tabId: number) => {
    allTabs.push(tabId);
});

useIpcOn('tab:destroyed', (_e, tabId: number) => {
    if (tabId === currentTabId.value) {
        const nextTab = allTabs[allTabs.indexOf(tabId) + 1] as number | undefined;
        if (nextTab) {
            currentTabId.value = nextTab;
        } else {
            const previousTab = allTabs[allTabs.indexOf(tabId) - 1] as number | undefined;
            currentTabId.value = previousTab ?? mainTabId;
        };
    };

    allTabs.splice(allTabs.indexOf(tabId), 1);
});
</script>

<template>
    <div ref="tabsContainer" class="main-window-tabs-container">
        <div class="main-window-tab-area">
            <NTabs
                v-model:value="currentTabId"
                closable
                type="card"
                trigger="click"
                tab-style="-webkit-app-region: no-drag;"
                @close="(tabId: number) => ipcSend('tab:destroy', tabId)"
            >
                <NTab
                    :key="mainTabId"
                    :name="mainTabId"
                    :closable="false"
                    :tab="() => h(BrowserTab, { id: mainTabId, isMainTab: true })"
                />

                <NTab
                    v-for="tabId of allTabs"
                    :key="tabId"
                    :name="tabId"
                    :tab="() => h(BrowserTab, { id: tabId, isMainTab: false })"
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
</style>